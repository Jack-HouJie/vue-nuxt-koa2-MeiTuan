// 用户模型接口
import Router from 'koa-router'
import Redis from 'koa-redis' // 用于保存验证码校验信息
import nodeMailer from 'nodemailer' // 用于node发邮件
import User from '../dbs/models/users' // 用户模型
import Passport from './utils/passport' // 验证模型
import Email from '../dbs/config' // 配置文件
import axios from './utils/axios' // 公用数据

// 声明路由:创建路由对象，设置前缀
let router = new Router({ prefix: '/users' })

// 获取redis客户端
let Store = new Redis().client

// 注册接口
router.post('/signup', async (ctx) => {
  // 解构赋值获取post请求参数
  const { username, password, email, code } = ctx.request.body
  // 从redis中获取 在nodemail发验证码的时候 的存储数据
  // 并将存储数据与浏览器获取的数据进行对比
  // 如果请求参数存在验证码
  if (code) {
    // 获取值：根据前缀nodemail+用户名找到指定用户
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    // 如果验证码相等
    if (code === saveCode) {
      // 如果过期
      if (new Date().getTime() - saveExpire > 0) {
        // 结果写入响应体
        ctx.body = {
          // 失败为-1 成功为0
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  // 根据用户名查询用户
  let user = await User.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // 写数据库
  let nuser = await User.create({ username, password, email })
  // 如果写入成功
  if (nuser) {
    // 调用登录接口自动登录
    let res = await axios.post('/users/signin', { username, password })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})
// 登录接口
router.post('/signin', async (ctx, next) => {
  // 调用passport方法验证（固定格式）
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        // 进行登录动作
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})
// 验证码验证接口
router.post('/verify', async (ctx, next) => {
  // 获取用户名和验证码过期时间
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  // 限制请求频率
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  // 设置发邮件对象：基于nodeMialer提供的方法
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    // 账户
    auth: {
      // 使用config里配置的数据
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 设置收邮件对象，发送相关信息
  let ko = {
    // 发邮件：直接使用config中封装好的接口
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 定义邮件内容
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《学习仿写美团网》注册码',
    html: `您在《学习仿写美团网》网页中注册，您的邀请码是${ko.code}`
  }

  // 执行发送邮件操作：使用提供的API，
  // 参数：邮件内容配置，发送后的回调函数
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      // 存储注册方信息(验证码，过期时间，邮箱)至redis
      // key使用规定的nodemail前缀
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  // 发送邮件后响应
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})
// 退出接口
router.get('/exit', async (ctx, next) => {
  // 执行注销操作
  await ctx.logout()
  // 进行二次验证，看是否成功注销掉，是否已认证
  // 如果成功注销
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})
// 获取用户
router.get('/getUser', async (ctx) => {
  // 如果是登陆状态(passport提供的固定API)
  if (ctx.isAuthenticated()) {
    // 从passport取出信息
    const { username, email } = ctx.session.passport.user
    // 返回信息存至响应体
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
