<template>
  <div class="m-crumbs">
    <!-- el-ui提供的面包屑组件 -->
    <el-breadcrumb separator=">">
      <!-- 用vuex获得数据（SSR） -->
      <el-breadcrumb-item :to="{ path: '/' }">
        {{ $store.state.geo.position.city.replace('市','') }}美团
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">
          {{ $store.state.geo.position.city.replace('市','') }}
          {{ decodeURIComponent(keyword) }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    }
  }
}
</script>
