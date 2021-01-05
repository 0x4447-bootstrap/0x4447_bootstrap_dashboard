const types = {
  LOADER_SET: 'LOADER_SET'
}

export const state = () => ({
  isShown: false
})

export const getters = {
  isShown (state) {
    return state.isShown
  }
}

export const actions = {
  set ({ commit }, isOpen = false) {
    commit(types.LOADER_SET, isOpen)
  }
}

export const mutations = {
  [types.LOADER_SET] (state, isOpen) {
    state.isShown = isOpen
  }
}
