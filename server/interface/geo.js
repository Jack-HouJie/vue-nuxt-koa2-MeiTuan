import Router from 'koa-router';
import axios from './utils/axios'
let router = new Router({ prefix: '/geo' })

/* 位置信息相关接口 */
// 1.2 查询当前省份/城市
router.get('/getPosition', async (ctx) => {
  // 使用第三方接口得到数据
  let { status, data: { province, city } } = await axios.get(`http://cp-tools.cn/geo/getPosition?abcd`)
  // 设置响应
  if (status === 200) {
    ctx.body = {
      province,
      city: province
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})


// 2.1 主页左侧菜单数据
router.get('/menu', async (ctx) => {
  let { status, data: { menu } } = await axios.get(`http://cp-tools.cn/geo/menu?abcd`);
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

// 4.1 省份列表
router.get('/province', async (ctx) => {
  let { status, data: { province } } = await axios.get(`http://cp-tools.cn/geo/province?${sign}`)
  ctx.body = {
    province: status === 200 ? province : []
  }
  // // 需要引入province模型，得到其find方法
  // let province = await Province.find()
  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     }
  //   })
  // }
})

// 4.1 得到指定省的城市
router.get('/province/:id', async (ctx) => {
  let { status, data: { city } } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
})

// 4.1得到全国所有城市
router.get('/city', async (ctx) => {
  let { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/city?${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }
})

// 4.2得到热门城市列表
router.get('/hotCity', async (ctx) => {

  let { status, data: {
    hots
  } } = await axios.get(`http://cp-tools.cn/geo/hotCity?${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }

  // let list = [
  //   '北京市',
  //   '上海市',
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
})

export default router;
