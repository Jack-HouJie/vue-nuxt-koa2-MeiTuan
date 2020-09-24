/* 基本配置 */
// 导入Koa
import Koa from 'koa'
// 创建一个Koa对象表示web app本身:
const app = new Koa()
// 指定服务器IP和端口号
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
// 导入并配置nuxt
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')
const { Nuxt, Builder } = require('nuxt')
// 导入打印日志工具
const consola = require('consola')


/* 1.4 数据库、session相关 */
// 引入mongoose
import mongoose from 'mongoose'
import session from 'koa-generic-session' // 处理session
import Redis from 'koa-redis' // 存储session
import dbConfig from './dbs/config' // 导入数据库配置
// json美化
import json from 'koa-json' // json美化
// 引入passport（处理session验证）
import passport from './interface/utils/passport'
// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
// session配置，设置key名，前缀，存储方式
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))

app.use(json())

// 添加passport中间件
app.use(passport.initialize())
app.use(passport.session())

app.keys = ['mt', 'keyskeys']
app.proxy = true

/* 路由相关 */
// 用于处理post请求参数（koa本身不支持）
import bodyParser from 'koa-bodyparser'
// 添加中间件并配置（必须在使用之前添加）
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
// 导入koa路由
import geo from './interface/geo' // 城市路由接口
import users from './interface/users' // 用户相关路由接口
import search from './interface/search' // 搜索路由接口
import categroy from './interface/categroy'
import cart from './interface/cart'
import order from './interface/order'


// 异步启动函数（处理每个http请求）
async function start () {
  // 实例化Nuxt对象
  const nuxt = new Nuxt(config)

  // 在开发模式下构建项目
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // 添加路由中间件
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(users.routes()).use(users.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())

  // 响应请求
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
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