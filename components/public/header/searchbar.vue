<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3"
              class="left">
        <a href="/"><img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
               alt="美团"></a>
      </el-col>
      <el-col :span="15"
              class="center">
        <div class="wrapper">
          <!-- 使用el-ui提供的输入框组件 -->
          <el-input v-model="search"
                    placeholder="搜索商家或地点"
                    @focus="focus"
                    @blur="blur"
                    @input="input" />
          <button class="el-button el-button--primary"><i class="el-icon-search" /></button>
          <!-- 搜索结果 -->
          <!-- 通过计算属性决定返回与否 -->
          <!-- 服务端SSR：通过vuex得到热门城市列表数据 -->
          <dl v-if="isHotPlace"
              class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
                :key="idx">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <dl v-if="isSearchList"
              class="searchList">
            <dd v-for="(item,idx) in searchList"
                :key="idx">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <!-- 服务端SSR：通过vuex得到热门城市列表数据 -->
        <p class="suggest">
          <a v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
             :key="idx"
             :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
        </p>
        <ul class="nav">
          <li>
            <!-- 通过不同类名实现不同hover效果 -->
            <nuxt-link to="/"
                       class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/"
                       class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/"
                       class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/"
                       class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/"
                       class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6"
              class="right">
        <ul class="security">
          <!-- <i ···/> 是图标 -->
          <li><i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li><i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li><i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash' // 用于延时
export default {
  data () {
    return {
      search: '', // 输入值双向绑定
      isFocus: false, // 搜索框聚焦状态
      hotPlace: [], // 热门地区循环渲染
      searchList: [], // 搜索结果循环渲染
      hotPlaceList: []
    }
  },
  // 重写的获取热门景点，但已经有使用过vuex，
  async mounted () {
    let that = this;
    let { status, data: { result } } = await that.$axios.get('search/hotPlace', {
      params: {
        city: that.$store.state.geo.position.city.replace('市', '')
      }
    })
    // console.log(that.hotPlaceList);

    if (status === 200) {
      that.hotPlaceList = result.slice(0, 5)
    } else {
      console.log("error!!!");
    }
  },
  computed: {
    isHotPlace: function () {
      // 搜索框聚焦且无值
      return this.isFocus && !this.search
    },
    isSearchList: function () {
      // 搜索框聚焦且有值
      return this.isFocus && this.search
    }
  },
  methods: {
    focus: function () {
      this.isFocus = true
    },
    blur: function () {
      // 闭包需要暂存this
      let self = this;
      // 延时，防止失焦热门结果直接消失无法点击
      setTimeout(function () {
        self.isFocus = false
      }, 200)
    },
    // 用于根据输入内容更新实时搜索结果
    // 借助loadsh库,延时300毫秒执行
    input: _.debounce(async function () {
      let self = this;
      // 从vuex取得当前城市，去掉“市”字（第三方服务限制）
      let city = self.$store.state.geo.position.city.replace('市', '')
      // 查询数据
      self.searchList = []
      let { status, data: { top } } = await self.$axios.get('/search/top', {
        params: {
          input: self.search,
          city
        }
      })
      // 数据填充
      self.searchList = top.slice(0, 10)
    }, 300)
  }
}
</script>

<style lang="css">
</style>
