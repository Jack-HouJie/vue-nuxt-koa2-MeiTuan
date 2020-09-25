<template>
  <div class="" />
</template>

<script>
export default {
  layout: 'blank',
  // nuxt生命周期的中间件阶段处理
  // 中间件阶段应用场景：无用户交互，需要自动触发
  middleware: async (ctx) => {
    let { status, data } = await ctx.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
