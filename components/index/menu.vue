<template>
  <div class="m-menu">
    <dl class="nav"
        @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <!-- 通过vuex获得menu数据实现SSR -->
      <!-- 实现SSR：nuxtServerInit阶段渲染 -->
      <dd @mouseenter="mouseenter"
          v-for="(item,idx) in $store.state.home.menu"
          :key="idx">
        <i :class="item.type" />{{ item.name }}<span class="arrow" />>
      </dd>
    </dl>
    <!-- 只在有kind时显示 -->
    <!-- 判断是否进入detail决定是否清空kind -->
    <div class="detail"
         v-if="kind"
         @mouseenter="sover"
         @mouseleave="sout">
      <!-- 通过template实现模块循环渲染 -->
      <template v-for="(item,idx) in curdetail.child">
        <h4 :key="idx">{{ item.title }}</h4>
        <span v-for="v in item.child"
              :key="v">{{ v }}</span>
      </template>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      // 记录鼠标hover时的菜单类型
      kind: '',
      // 菜单模拟数据，实际通过vuex实现SSR
      menu: [{
        type: 'food', // 更新不同的类，显示不同的图标
        name: '美食',
        // 用于细节
        child: [{
          title: '美食',
          child: ['代金卷', '甜点', '饮品', '火锅', '自助餐']
        }]
      }, {
        type: 'takeout',
        name: '外卖',
        child: [{
          title: '外卖',
          child: ['美团外卖']
        }]
      }, {
        type: 'hotel',
        name: '酒店',
        child: [{
          title: '酒店星级',
          child: ['经济型', '舒适/三星', '高档/四星', '豪华/五星']
        }]
      }]
    }
  },
  computed: {
    curdetail: function () {
      return this.$store.state.home.menu.filter((item) => item.type === this.kind)[0]
    }
  },
  methods: {
    mouseleave: function () {
      let self = this;
      // 延时处理 防止直接消失
      self._timer = setTimeout(function () {
        self.kind = ''
      }, 150)
    },
    mouseenter: function (e) {
      // 利用原生事件更新kind
      this.kind = e.target.querySelector('i').className
    },
    sover: function () {
      // 如过移出左边进入detail则不再清空kind
      clearTimeout(this._timer)
    },
    sout: function () {
      // 移出detial直接清空kind，不再显示detail区域
      this.kind = ''
    }
  }
}
</script>
<style lang='scss' >
</style>
