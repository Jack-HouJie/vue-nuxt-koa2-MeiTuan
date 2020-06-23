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
  // 计算total
  computed: {
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
      // 发送创建订单请求获得 code? , 订单ID
      const { status, data: { code, id } } = await this.$axios.post('/order/createOrder', {
        id: this.cartNo,
        price: this.cart[0].price,
        count: this.cart[0].count
      })
      if (status === 200 && code === 0) {
        this.$alert(`恭喜您，已成功下单，订单号:${id}`, '下单成功', {
          confirmButtonText: '确定',
          callback: action => {
            location.href = '/order'
          }
        })
      }
    }
  },
  // ssr：获取指定购物车数据并渲染
  async asyncData (ctx) {
    // 得到路由get请求查询字符串，购物车id
    let id = ctx.query.id
    // 发送请求获取指定ID购物车数据
    let { status, data: { code, data: { name, price } } } = await ctx.$axios.post('cart/getCart', { id })
    if (status === 200 && code === 0 && name) {
      return {
        // 更新组件数据实现SSR
        cart: [{
          name, price, count: 1
        }],
        cartNo: ctx.query.id
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/cart/index.scss';
</style>
