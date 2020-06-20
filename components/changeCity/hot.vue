<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd v-for="item in list"
          :key="item.id"
          @click="selectCity">
        <nuxt-link to="/">{{ item.name==='市辖区'?item.province:item.name }}</nuxt-link>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  // 异步获取数据（非SSR）
  async mounted () {
    let { status, data: { hots } } = await this.$axios.get('/geo/hotCity')
    if (status === 200) {
      this.list = hots
    }
  },
  methods: {
    selectCity (e) {
      // 发送切换城市请求
      this.$store.dispatch('geo/setPosition', {
        city: e.target.innerText
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/changeCity/hot.scss';
</style>
