import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

// 引入一些重要包
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser' // 处理post请求
import session from 'koa-generic-session' // 处理session
import Redis from 'koa-redis'
import json from 'koa-json' // json美化
import dbConfig from './dbs/config' // 导入数据库配置
import passport from './interface/utils/passport' // 处理session验证
import users from './interface/users' // users服务
import geo from './interface/geo' // 城市服务
import search from './interface/search' // 搜索服务
import categroy from './interface/categroy'
import cart from './interface/cart'
import order from './interface/order'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.keys = ['mt', 'keyskeys']
app.proxy = true
// session配置，设置key名，前缀，存储方式
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))
// 配置post请求参数
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
app.use(json())


// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})

// passport相关配置
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // 导入和配置接口路由
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({ message: `Server listening on http://${host}:${port}`, badge: true })
}

start()
