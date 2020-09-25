/* 基本配置 */
import Koa from 'koa' // Koa
import consola from 'consola' // 打印日志工具
import { Nuxt, Builder } from 'nuxt' // nuxt、nuxt构建模块
import config from '../nuxt.config.js' // 配置信息
// 初始化koa、nuxt，指定代理域名和端口号
const app = new Koa()
config.dev = !(app.env === 'production')
app.proxy = true
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

/* 1.4 数据库、session相关 */
import dbConfig from './dbs/config' // 数据库配置
import mongoose from 'mongoose' // mongoose
import Redis from 'koa-redis' // 存储session
import session from 'koa-generic-session' // 处理session
import passport from './interface/utils/passport'// 处理session验证
import json from 'koa-json' // json美化
// 连接数据库
mongoose.connect(dbConfig.dbs, { useNewUrlParser: true })
// 设置中间件
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))
app.keys = ['mt', 'keys']
app.use(passport.initialize())
app.use(passport.session())
app.use(json())

/* 路由相关 */
import bodyParser from 'koa-bodyparser' // 处理post请求参数
import geo from './interface/geo' // koa城市路由接口
import users from './interface/users' // koa用户相关路由接口
import search from './interface/search' // koa搜索路由接口
import categroy from './interface/categroy'// koa路由
import cart from './interface/cart'// koa路由
import order from './interface/order'// koa路由

// 设置中间件
app.use(bodyParser({ extendTypes: ['json', 'form', 'text'] }))

// Koa主启动函数
async function start () {
  // 实例化Nuxt对象传入配置信息
  const nuxt = new Nuxt(config)
  // 在开发模式下构建项目
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // 添加中间件
  // koa路由处理
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(users.routes()).use(users.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  // 结果处理
  app.use(ctx => {
    ctx.status = 200 // 响应状态码
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      // 通过nuxt渲染错误信息
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  // 监听指定端口
  app.listen(port, host)

  // 打印日志
  consola.ready({ message: `Server listening on http://${host}:${port}`, badge: true })
}
start()