<template>
  <!-- 使用el-ui实现布局 -->
  <!-- gutter指定间隔 -->
  <el-row :gutter="0"
          class="m-header">
    <!-- 通过span调整列宽比例 -->
    <el-col :span="5">
      <!-- 使用组件 -->
      <geo />
    </el-col>
    <el-col :span="5">
      <user />
    </el-col>
    <el-col :span="14">
      <navbar />
    </el-col>
  </el-row>
</template>

<script>
// 引入组件
import Geo from './geo'
import User from './user'
import Navbar from './nav'
// 声明组件
export default {
  components: {
    Geo,
    User,
    Navbar
  },
};
</script>
<style lang="scss">
</style>
