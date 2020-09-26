import Router from 'koa-router'
import Order from '../dbs/models/order'
import Cart from '../dbs/models/cart' // 导入购物车实例
import md5 from 'crypto-js/md5'
const router = new Router({ prefix: '/order' })

// 8.2 创建订单，返回订单id（用于支付等功能）
router.post('/createOrder', async (ctx) => {
  // 验证是否登录
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: '请先登录!'
    }
  } 
  else {
    const { id, price, count } = ctx.request.body // 购物车ID，单价，数量（读post参数）
    const tiem = Date() // 订单创建时间
    const orderID = md5(Math.random() * 1000 + tiem).toString() // 订单ID（MD5加密）
    const findCart = await Cart.findOne({ cartNo: id }) // 购物车模型实例（mongoose读）
    // 创建订单模型实例
    const order = new Order({
      id: orderID, // 订单ID
      count, // 商品数量
      total: price * count, // 订单总价
      time, // 订单创建时间
      user: ctx.session.passport.user, // 用户名
      name: findCart.detail[0].name, // 商品名(购物车实例中)
      imgs: findCart.detail[0].imgs, // 商品图链接(购物车实例中)
      status: 0 // 订单状态
    })
    // 保存订单，删除购物车
    try {
      const result = await order.save()
      // 如果保存正常
      if (result) {
        // 数据库中删除指定购物车
        await findCart.remove()
        ctx.body = {
          code: 0,
          id: orderID // 订单ID
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1
      }
    }
  }
})

// 9.1 获取所有订单
router.post('/getOrders', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    }
  } else {
    try {
      const result = await Order.find() // 找到指定订单(未实现)
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
})

export default router