<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list"
          :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl v-for="item in block"
        :key="item.title"
        class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <!--<nuxt-link to="/">-->
        <span v-for="c in item.city"
              :key="c"
              @click="changeTheCity(c)">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin' // 处理中文拼音的库
export default {
  data () {
    return {
      list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block: []
    }
  },
  async mounted () {
    let self = this;
    // 获取数据(全国所有城市)（非SSR）
    let blocks = [] // 保存首字母与城市对应
    let { status, data: { city } } = await self.$axios.get('/geo/city');
    if (status === 200) {
      let p // 城市拼音首字母
      let c // 城市拼音首字母的字符编码
      //获取首字母下的所有城市名
      let d = {} // 保存首字母和城市对应关系
      city.forEach(item => {
        // 获取拼音全拼，并取得首字母（字符串）
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
        // 取得字符串第一个位置的字符的字符编码
        c = p.charCodeAt(0)
        // 字符编码：大写A~Z: 65~90 小写a~z: 97~122
        // 如果是小写字母
        if (c > 96 && c < 123) {
          // 初始化p字段为一个数组
          if (!d[p]) {
            d[p] = []
          }
          // 把当前城市入栈
          d[p].push(item.name)
        }
      })
      // 从临时对象到数组的转变
      for (let [key, value] of Object.entries(d)) {
        blocks.push({
          // 数据结构对应，方便修改
          title: key.toUpperCase(), // 大写首字母
          city: value // 对应城市
        })
      }
      // 根据首字母排序
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      self.block = blocks
    }
  },
  methods: {
    // 更换城市
    changeTheCity: function (val) {
      // 更新当前城市
      let that = this;
      that.$store.dispatch('geo/setPosition', {
        city: val
      })
      // 跳转回主页
      that.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/changeCity/categroy.scss';
</style>
