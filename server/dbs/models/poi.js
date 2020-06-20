// POI模型：保存景点数据

import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Poi = new Schema({
  name: {
    type: String//景点名
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  county: {
    type: String
  },
  areaCode: {
    type: String
  },
  tel: {
    type: String
  },
  area: {
    type: String
  },
  addr: {
    type: String
  },
  type: {
    type: String
  },
  module: {
    type: String
  },
  // 经纬度，用于地图映射
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  }
})

export default mongoose.model('Poi', Poi)
