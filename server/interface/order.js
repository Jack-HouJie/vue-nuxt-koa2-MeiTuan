import Router from 'koa-router'
import Order from '../dbs/models/order'
// 导入购物车实例
import Cart from '../dbs/models/cart'
// 加密
import md5 from 'crypto-js/md5'

const router = new Router({ prefix: '/order' })

// 创建订单，返回订单id（用于支付等功能）
router.post('/createOrder', async (ctx) => {
  // 读请求参数：购物车id，金额，数量
  const { id, price, count } = ctx.request.body
  // 创建订单加密ID
  const time = Date()
  const orderID = md5(Math.random() * 1000 + time).toString()
  // 验证是否登录
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: '请先登录!'
    }
  } else {
    // Cart查操作得到购物车模型
    // findOne：找到第一个就返回
    const findCart = await Cart.findOne({ cartNo: id })
    // 创建订单模型实例
    const order = new Order({
      id: orderID,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    })
    // 创建成功时入库
    try {
      const result = await order.save()
      // 如果入库正常
      if (result) {
        // 数据库中删除指定购物车
        // (因为购物车是临时状态)
        await findCart.remove()
        ctx.body = {
          code: 0,
          //响应体传回订单 
          id: orderID
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

// 获取所有订单
router.post('/getOrders', async ctx => {
  // passport验证登录
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    }
  } else {
    // 容错处理
    try {
      // Order模型查操作
      const result = await Order.find()
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