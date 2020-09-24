const actions = {
  setPosition: ({ commit }, position) => {
    commit('setPosition', position)
  }
}

const mutations = {
  setPosition (state, val) {
    state.position = val
  }
}

const state = () => ({ position: {} })

export default { namespaced: true, state, mutations, actions }
