import passport from 'koa-passport' // 权限验证管理中间件
import LocalStrategy from 'passport-local' // 权限验证策略中间件
import UserModel from '../../dbs/models/users' // mongoDB用户model
// 设置权限验证策略
passport.use(new LocalStrategy(async function (username, password, done) {
  let where = { username } // 查询条件
  // mongoDb中找到指定用户模型实例
  let result = await UserModel.findOne(where)
  if (result != null) {
    if (result.password === password) { // 匹配密码      
      return done(null, result) // 使用done回调函数返回用户实例
    } else {
      return done(null, false, '密码错误') // 返回false及提示
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))
// 序列化：验证成功后把用户数据序列化存入session
passport.serializeUser(function (user, done) {
  done(null, user)
})
// 反序列化：从session中反序列化得到用户数据
passport.deserializeUser(function (user, done) {
  return done(null, user)
})
export default passport
