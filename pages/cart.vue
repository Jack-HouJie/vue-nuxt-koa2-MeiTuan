<template>
  <div class="page-cart">
    <el-row>
      <el-col v-if="cart.length"
              :span="24"
              class="m-cart">
        <list :cart-data="cart" />
        <p>
          应付金额：<em class="money">￥{{ total }}</em>
        </p>
        <div class="post">
          <el-button type="primary"
                     @click="submit">提交订单</el-button>
        </div>
      </el-col>
      <el-col v-else
              class="empty">购物车为空
      </el-col>
    </el-row>
  </div>
</template>

<script>
import List from '@/components/cart/list.vue'
export default {
  components: {
    List
  },
  data () {
    return {
      cart: []
    }
  },
  computed: {
    // 计算total
    total () {
      let total = 0;
      // 依赖计算
      this.cart.forEach(item => {
        total += item.price * item.count
      })
      return total
    }
  },
  methods: {
    // 提交订单
    submit: async function () {
      // 发送创建订单请求
      const { status, data: { code, id } } = await this.$axios.post('/order/createOrder', {
        id: this.cartNo, // 购物车ID
        price: this.cart[0].price, // 单价
        count: this.cart[0].count // 数量
      })
      if (status === 200 && code === 0) {
        this.$alert(`恭喜您，已成功下单，订单号:${id}`, '下单成功', {
          confirmButtonText: '确定',
          callback: action => {
            location.href = '/order' // 传统超链接跳转，实现SSR
          }
        })
      }
    }
  },
  // 获取指定购物车数据（SSR）
  async asyncData (ctx) {
    let id = ctx.query.id // 购物车ID（读取请求查询字符串参数）
    // 指定购物车ID得到购物车信息
    let { status, data: { code, data: { name, price } } } = await ctx.$axios.post('cart/getCart', { id })
    // 更新组件Data实现SSR
    if (status === 200 && code === 0 && name) {
      return {
        cart: [{
          name, // 商品名
          price, // 价格
          count: 1 // 数量
        }],
        cartNo: ctx.query.id // 购物车ID
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/cart/index.scss';
</style>
