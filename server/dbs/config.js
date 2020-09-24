export default {
  // 1.3配置数据库
  dbs: 'mongodb://127.0.0.1:27017/Meituan',
  redis: {
    // 只读配置
    get host () {
      return '127.0.0.1'
    },
    get port () {
      return 6379
    }
  },
  smtp: {
    // 封装基础功能，方便调用
    // QQ邮箱服务
    get host () {
      return 'smtp.qq.com'
    },
    get user () {
      return '656371995@qq.com' //填入你的邮箱
    },
    get pass () {
      //授权码(邮箱设置得到)
      return 'jnnimsbypzawbaib'
    },
    get code () {
      // 生成验证码
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    get expire () {
      // 验证码过期
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}
