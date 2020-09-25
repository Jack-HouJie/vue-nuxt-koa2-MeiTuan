<template>
  <!-- el-ui 自定义模版 -->
  <!-- cartData为表格数据 -->
  <el-table :data="cartData"
            style="width: 980px">
    <el-table-column prop="name"
                     label="项目"
                     width="532" />
    <el-table-column prop="price"
                     label="单价"
                     width="132" />


    <el-table-column label="数量"
                     width="212">
      
      <template slot-scope="scope">
        <!-- el-ui 计数器组件 -->
        <el-input-number v-model="scope.row.count"
                         :min="0" />
      </template>
      
    </el-table-column>


    <el-table-column label="总价">
      <template slot-scope="scope">
        <div>
          {{ scope.row.price*scope.row.count }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    // 购物车信息
    cartData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
