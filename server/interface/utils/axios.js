// 全局数据
import axios from 'axios'
// 创建一个axios实例
const instance = axios.create({
  // 进程环境变量设置
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  timeout: 2000,
  headers: {
  }
})

export default instance
