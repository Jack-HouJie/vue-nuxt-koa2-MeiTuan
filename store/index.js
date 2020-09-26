export const actions = {
  // Nuxt实现：页面渲染前异步获取数据并更新state
  async nuxtServerInit ({ commit }, { req, app }) {
    // 1.2 当前省份/城市
    const { status, data: { province, city } } = await app.$axios.get('/geo/getPosition')
    commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })

    // 1.2 指定城市热门景点
    const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
      params: {
        city: app.store.state.geo.position.city.replace('市', '') // 参数指定城市
      }
    })
    commit('home/setHotPlace', status3 === 200 ? result : [])

    // 2.1 主页左侧菜单数据
    const { status: status2, data: { menu } } = await app.$axios.get('/geo/menu')
    commit('home/setMenu', status2 === 200 ? menu : [])
  }
}
