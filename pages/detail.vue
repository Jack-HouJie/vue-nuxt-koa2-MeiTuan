<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs :keyword="keyword"
                :type="type" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="product" />
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>商家团购及优惠</h3>
      </el-col>
    </el-row>
    <!-- 能购买 或 未登录时显示模块 -->
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <!-- 如果登陆，展示list子组件 -->
        <list v-if="login"
              :list="list" />
        <!-- 如果没登陆 -->
        <div v-else
             class="deal-need-login">
          <img src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
               alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button type="primary"
                     round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Crumbs from '@/components/detail/crumbs.vue';
import Summa from '@/components/detail/summary.vue'
import List from '@/components/detail/list.vue'
export default {
  components: {
    Crumbs,
    Summa,
    List
  },
  computed: {
    // 通过是否有图片判断当前产品能否购买，模拟线上购买状态
    canOrder: function () {
      return this.list.filter(item => item.photos.length).length
    }
  },
  // NUXT异步获取数据，返回的值自动写入Data
  async asyncData (ctx) {
    // NUXT从收到的请求url查询字符串中得到关键词和类型（用于面包屑导航）
    let { keyword, type } = ctx.query;
    // 根据根据关键词、类型、城市发送请求得到指定产品概要信息（用于产品概要）
    let { status, data: { product, more: list, login } } = await ctx.$axios.get('/search/products', {
      params: {
        keyword, // 关键词
        type, // 类型
        city: ctx.store.state.geo.position.city // 城市
      }
    })
    if (status === 200) {
      return {
        keyword, // 关键词
        product, // 产品 
        type, // 类型
        list, // 商家团购和优惠产品列表
        login // 是否登录
      }
    } else {
      return {
        keyword,
        product: {},
        type,
        list: [],
        login: false
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/detail/index.scss';
</style>
