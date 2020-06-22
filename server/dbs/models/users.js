import mongoose from 'mongoose'
// 建立用户模型（对应集合）
const Schema = mongoose.Schema
const UserSchema = new Schema({
  // 设置每个文档的域
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  }
})

// 生成模型并导出
export default mongoose.model('User', UserSchema)
