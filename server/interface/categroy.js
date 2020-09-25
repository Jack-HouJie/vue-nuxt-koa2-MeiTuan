import Router from 'koa-router'
import axios from './utils/axios'

let router = new Router({ prefix: '/categroy' })
// 三方接口签名
const sign = 'abcd';

// 5.1 
router.get('/crumbs', async (ctx) => {
  // 使用三方接口获取数据，实际开发中可读数据库
  let { status, data: { areas, types } } = await axios.get('http://cp-tools.cn/categroy/crumbs', {
    params: {
      city: ctx.query.city.replace('市', '') || "北京",
      sign
    }
  })
  ctx.body = {
    areas: status === 200 ? areas : [],
    types: status === 200 ? types : []
  }
  // // 本地数据库操作
  // let result = await Categroy.findOne({city: ctx.query.city.replace('市', '') || '北京'})
  // if (result) {
  //   ctx.body = {
  //     areas: result.areas,
  //     types: result.types
  //   }
  // } else {
  //   ctx.body = {
  //     areas: [],
  //     types: []
  //   }
  // }
})


export default router
