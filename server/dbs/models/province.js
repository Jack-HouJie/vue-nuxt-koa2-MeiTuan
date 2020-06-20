import mongoose from 'mongoose'
const Schema = mongoose.Schema
// 省市模型
const Province = new Schema({
  id: {
    type: String,
    require: true
  },
  value: {
    type: Array,
    require: true
  }
})

export default mongoose.model('Province', Province)
