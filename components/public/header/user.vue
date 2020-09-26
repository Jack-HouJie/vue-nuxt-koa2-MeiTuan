<template>
  <div class="m-user">
    <!-- 借助template模块条件渲染多个元素 -->
    <!-- 如果有用户信息 -->
    <template v-if="user">
      欢迎您，
      <!-- 本处非SSR 
      因为user数据是从data中获取的
      而data数据是组件挂载后由前端发请求得到的-->
      <span class="username">
        {{ user }}
      </span>
      [<nuxt-link to="/exit">
        退出
      </nuxt-link>]
    </template>
    <!-- 如果没有用户 -->
    <template v-else>
      <nuxt-link class="login"
                 to="/login">
        立即登录
      </nuxt-link>
      <nuxt-link class="register"
                 to="/register">
        注册
      </nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: ''
    }
  },
  // 获取数据（非SSR）
  async mounted () {
    // 发送请求，解构赋值得到await异步结果
    const { status, data: { user } } = await this.$axios.get('/users/getUser')
    // 如果服务器响应成功
    if (status === 200) {
      this.user = user
    }
  }
}
</script>

<style lang="css">
</style>
