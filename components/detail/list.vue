<template>
  <div class="m-detail-list">
    <ul>
      <!-- 数据过滤：不用无图片数据 -->
      <li>
        {{list.filter(item=>item.photos.length).length}}款套餐
      </li>
      <item v-for="(item,idx) in list"
            :key="idx"
            :meta="item" />
    </ul>
  </div>
</template>

<script>
import Item from './item'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return
      }
    }
  },
  components: {
    Item
  }
}

</script>
<style lang='scss'>
</style>