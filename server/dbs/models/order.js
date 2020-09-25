import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Order = new Schema({
  // 订单ID
  id: {
    type: String,
    require: true
  },
  // 用户名
  user: {
    type: String,
    require: true
  },
  // 订单创建时间
  time: {
    type: String,
    require: true
  },
  // 订单总价
  total: {
    type: Number,
    require: true
  },
  // 商品图
  imgs: {
    type: Array,
    require: true
  },
  // 商品名
  name: {
    type: String,
    require: true
  },
  // 订单状态
  status: {
    type: Number,
    require: true
  }
})
export default mongoose.model('Order', Order)

