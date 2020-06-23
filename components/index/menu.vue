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
        <i :class="item.type" />{{ item.name }}<span class="arrow" />
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
      kind: ''
    }
  },
  computed: {
    curdetail: function () {
      return this.$store.state.home.menu.filter((item) => item.type === this.kind)[0]
    }
  },
  methods: {
    mouseenter: function (e) {
      // 利用原生事件更新kind
      // 通过DOM选择符API找到触发事件元素中第一个i标签的类名
      this.kind = e.target.querySelector('i').className
    },
    mouseleave: function () {
      let self = this;
      // 延时处理 防止直接消失
      self._timer = setTimeout(function () {
        self.kind = ''
      }, 150)
    },
    sover: function () {
      // 移出主菜单进入detail时固定kind
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
