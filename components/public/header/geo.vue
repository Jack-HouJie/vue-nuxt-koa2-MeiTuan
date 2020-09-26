<template>
  <div class="m-geo">
    <!-- SSR(nuxt初始化更新vuex) -->
    <i class="el-icon-location" />
    {{ $store.state.geo.position.city }}
    <nuxt-link class="changeCity"
               to="/changeCity">
      切换城市
    </nuxt-link>
    <!--[香河 廊坊 天津]-->
    <!--热门：{{hotPlaceList}}-->
    <!--{{$store.state.home.hotPlace.slice(0,3)}}-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      hotPlaceList: []
    }
  },
  async mounted () {
    let self = this;
    // 根据当前城市请求热点地点，解构赋值
    let { status, data: { result } } = await self.$axios.get('/search/hotPlace', {
      params: {
        city: self.$store.state.geo.position.city
      }
    })
    if (status === 200 && result) {
      self.hotPlaceList = result.slice(0, 3);
      //console.log(self.hotPlaceList)
      if (self.hotPlaceList.length === 0) {
        self.hotPlaceList.name = "该地区暂未发现";
      }
    } else {
      //console.log(`请求失败`+self.hotPlaceList)
      self.hotPlaceList.name = "该地区暂未发现";
    }
  },
}
</script>

<style lang="css">
</style>
