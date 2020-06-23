import Router from 'koa-router';
import Cart from '../dbs/models/cart'
import md5 from 'crypto-js/md5'

let router = new Router({ prefix: '/cart' })

// 创建购物车（返回cartNo）
router.post('/create', async ctx => {
  // 创建之前需要进行登录拦截
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    // 创建购物车加密ID
    let time = Date()
    let cartNo = md5(Math.random() * 1000 + time).toString()

    // 获取post请求参数（产品ID、产品细节）
    let { params: { id, detail } } = ctx.request.body

    // 根据产品信息创建一个购物车模型实例
    // user可通过session下passport对象获取
    let cart = new Cart({ id, cartNo, time, user: ctx.session.passport.user, detail })
    // 模型写操作（实例存入数据库）
    let result = await cart.save()
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo  // 返回购物车id
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

// 获取购物车信息
router.post('/getCart', async ctx => {
  // 从get请求查询字符串得到中购物车ID
  let { id } = ctx.request.body
  try {
    // Cart模型查操作
    let result = await Cart.findOne({ cartNo: id })
    ctx.body = {
      code: 0,
      data: result ? result.detail[0] : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

export default router
