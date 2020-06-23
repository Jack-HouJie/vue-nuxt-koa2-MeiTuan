import Router from 'koa-router';
import axios from './utils/axios'

let router = new Router({ prefix: '/geo' })
// 请求课程提供的接口数据签名
const sign = 'abcd'

// 得到城市位置
router.get('/getPosition', async (ctx) => {
  // 使用第三方接口得到城市数据
  // 解构赋值得到数据
  let {
    status,
    data: {
      province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign`)
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

// 得到热门城市列表
router.get('/hotCity', async (ctx) => {
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  let { status, data: {
    hots
  } } = await axios.get(`http://cp-tools.cn/geo/hotCity?sign`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})

// 得到省列表
router.get('/province', async (ctx) => {
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
  let { status, data: {
    province
  } } = await axios.get(`http://cp-tools.cn/geo/province?sign`)
  ctx.body = {
    province: status === 200
      ? province
      : []
  }
})

// 得到指定省的城市
router.get('/province/:id', async (ctx) => {
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  let { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/city', async (ctx) => {
  // let city = []
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
  let { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/city?sign`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})



// 得到首页左侧菜单
router.get('/menu', async (ctx) => {
  // const result = await Menu.findOne()
  // ctx.body = {
  //   menu: result.menu
  // }
  let { status, data: {
    menu
  } } = await axios.get(`http://cp-tools.cn/geo/menu?sign`);
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

export default router;
