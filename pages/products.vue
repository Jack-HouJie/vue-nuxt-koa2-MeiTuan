<template>
  <el-row class="page-product">
    <!-- 左侧三个组件 -->
    <el-col :span="19">
      <!-- 面包屑组件 -->
      <crumbs :keyword="keyword" />
      <!-- 分类组件 -->
      <categroy :types="types"
                :areas="areas" />
      <!-- 列表组件 -->
      <list :list="list" />
    </el-col>
    <el-col :span="5">
      <!-- 地图组件 -->
      <amap v-if="point.length"
            :width="230"
            :height="290"
            :point="point" />
    </el-col>
  </el-row>

</template>

<script>
import Crumbs from '@/components/products/crumbs.vue'
import Categroy from '@/components/products/categroy.vue'
import List from '@/components/products/list.vue'
import Amap from '@/components/public/map.vue'
export default {
  components: {
    Crumbs,
    Categroy,
    List,
    Amap
  },
  data () {
    return {
      list: [],
      types: [],
      areas: [],
      keyword: '',
      point: []
    }
  },
  // nuxt 异步数据 方式(nuxt发送请求，数据渲染实现SSR）
  async asyncData (ctx) {
    // 用户关键词
    let keyword = ctx.query.keyword
    // 用户城市
    let city = ctx.store.state.geo.position.city
    // 向服务端相应接口发送请求
    let { status, data: { count, pois } } = await ctx.$axios.get('/search/resultsByKeywords', {
      params: {
        keyword,
        city
      }
    })
    let { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
      params: {
        city
      }
    })
    if (status === 200 && count > 0 && status2 === 200) {
      return {
        // 过滤图片，只保留有图片数据
        list: pois.filter(item => item.photos.length).map(item => {
          // 做数据映射，对应于product.vue界面数据结构
          return {
            type: item.type,
            img: item.photos[0].url,
            name: item.name,
            comment: Math.floor(Math.random() * 10000),
            rate: Number(item.biz_ext.rating),
            price: Number(item.biz_ext.cost),
            scene: item.tag,
            tel: item.tel,
            status: '可订明日',
            location: item.location,
            module: item.type.split(';')[0]
          }
        }),
        keyword,
        areas: areas.filter(item => item.type !== '').slice(0, 5),
        types: types.filter(item => item.type !== '').slice(0, 5),
        point: (pois.find(item => item.location).location || '').split(',')
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/products/index.scss';
</style>
