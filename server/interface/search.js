import Router from 'koa-router';
import axios from './utils/axios';

let router = new Router({ prefix: '/search' })

const sign = 'abcd';

// 实时搜索接口
// 根据输入内容，获取相关最热门的吃喝玩乐，返回name,type
router.get('/top', async (ctx) => {
  // 本处用线上接口获取数据，
  // 也可以使用本地数据（通过mongooes读写）
  let { status, data: { top } } = await axios.get('http://cp-tools.cn/search/top', {
    // 另一种参数写法
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign
    }
  })
  ctx.body = {
    top: status === 200 ? top : []
  }
})

// 热门景点接口
// 查询当前城市city所有热门景点place，返回name,type
router.get('/hotPlace', async (ctx) => {
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  // 本处使用第三方接口查询，也可以用mongoose读写本地数据库
  let { status, data: {
    result
  } } = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
    params: {
      city,
      sign
    }
  })
  ctx.body = {
    result: status === 200 ? result : []
  }
})

// 2.3 主页“有格调”部分
// 5.1 面包屑导航
// 根据不同的keyword返回当前城市相关景点
router.get('/resultsByKeywords', async (ctx) => {
  const { city, keyword } = ctx.query;
  // 本处读模拟接口，实际读本地数据库
  let { status, data: { count, pois } } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ? pois : []
  }
})

// 通过关键词获取当地城市的商品
router.get('/products', async (ctx) => {
  let city = ctx.query.city || '北京';
  let keyword = ctx.query.keyword || '旅游';
  let { status, data: {
    product, more
  } } = await axios.get('http://cp-tools.cn/search/products', {
    params: {
      city,
      keyword,
      sign
    }
  })

  // passport库提供的isAuthenticated()方法用来判断是否登录
  if (status === 200) {
    ctx.body = {
      product,
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  } else {
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }
})


export default router