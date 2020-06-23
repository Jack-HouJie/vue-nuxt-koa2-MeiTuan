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
let redisCli = new Redis().client


// 发送验证码接口
router.post('/verify', async (ctx, next) => {
  // 获取 请求中 用户名和验证码过期时间
  let username = ctx.request.body.username
  // 获取 Redis中 用户名和验证码过期时间
  const saveExpire = await redisCli.hget(`nodemail:${username}`, 'expire')
  // 如果存在发送限制时间，且当前未到发送限制时间
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
    // 直接使用config中封装好的接口
    code: Email.smtp.code(), // 验证码
    expire: Email.smtp.expire(), // 过期时间
    email: ctx.request.body.email, // 注册邮箱
    user: ctx.request.body.username // 用户名
  }
  // 设置邮件信息对象
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`, // 发件人
    to: ko.email, // 收件人
    subject: '《学习仿写美团网》注册码', // 标题
    html: `您在《学习仿写美团网》网页中注册，您的邀请码是${ko.code}` // 内容
  }

  // 使用API发送邮件，
  // 参数：邮件信息对象，回调函数
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      // 存储注册方信息(验证码，过期时间，邮箱)至redis
      // key使用规定的前缀
      redisCli.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  // 发送邮件后响应
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 注册接口
router.post('/signup', async (ctx) => {
  // 解构赋值获取post请求参数
  const { username, password, email, code } = ctx.request.body
  // 比对验证码：注册请求的参数和Redis的数据(发验证码邮件时存的)
  // 如果请求参数存在验证码
  if (code) {
    // 读Redis验证码
    const saveCode = await redisCli.hget(`nodemail:${username}`, 'code')
    // 读Redis限制时间
    const saveExpire = await redisCli.hget(`nodemail:${username}`, 'expire')
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

  // User模型查操作
  let user = await User.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // User模型写操作
  let nuser = await User.create({ username, password, email })
  // 如果写入成功
  if (nuser) {
    // 调用登录接口自动登录
    let res = await axios.post('/users/signin', { username, password })
    // 如果登陆成功
    if (res.data && res.data.code === 0) {
      // 响应
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

// 获取用户（默认模版头步当前用户信息）
router.get('/getUser', async (ctx) => {
  // 如果是登陆状态
  // 当前请求的passport存在其session中
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

// 退出登陆
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

export default router
