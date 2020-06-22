import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Cart = new Schema({
  // 购物车ID
  id: {
    type: String,
    require: true
  },
  detail: {
    type: Array,
    require: true
  },
  cartNo: {
    type: String,
    require: true
  },
  // 用户
  user: {
    type: String,
    require: true
  },
  // 购物车创建时间
  time: {
    type: String,
    require: true
  }
})

export default mongoose.model('Cart', Cart)
