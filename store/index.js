export const actions = {
  // nuxt生命周期中服务初始化阶段
  // 获取数据实现SSR
  async nuxtServerInit ({
    commit
  }, { req, app }) {
    // 通过app拿到实例
    // 解构赋值异步Ajax请求，得到当前城市数据
    const { status, data: { province, city } } = await app.$axios.get('/geo/getPosition')
    // 调用在geo.js定义好的commit
    // 进行简单检查
    commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })
    // 解构赋值异步请求得到菜单数据
    const { status: status2, data: { menu } } = await app.$axios.get('/geo/menu')
    // 掉用在home.js定义好的commmit
    commit('home/setMenu', status2 === 200 ? menu : [])
    // 解构赋值异步请求得到热门城市数据
    const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
      params: {
        city: app.store.state.geo.position.city.replace('市', '')
      }
    })
    // 掉用在home.js定义好的commmit
    commit('home/setHotPlace', status3 === 200 ? result : [])
  }
}
