import Router from 'koa-router';
import Cart from '../dbs/models/cart' // 购物车模型
import md5 from 'crypto-js/md5'

let router = new Router({ prefix: '/cart' })

// 7.4 创建新购物车
router.post('/create', async ctx => {
  // 登录状态验证
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    // 创建购物车实例
    let cartNo = md5(Math.random() * 1000 + Date()).toString() // 购物车ID(MD5加密)
    let { params: { id, detail } } = ctx.request.body // 读取产品信息（post请求体参数）
    let cart = new Cart({ id, cartNo, time, user: ctx.session.passport.user, detail }) 
    let result = await cart.save() // 模型写操作（实例存入mongoose数据库）
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

// 8.1 获取购物车信息
router.post('/getCart', async ctx => {
  let { id } = ctx.request.body // Post请求体中得到购物车ID
  try {
    let result = await Cart.findOne({ cartNo: id }) // 读指定ID购物车
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
