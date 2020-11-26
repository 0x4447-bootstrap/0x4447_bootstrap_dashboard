const types = {
  NOTIFICATION_SHOW: 'NOTIFICATION_SHOW',
  NOTIFICATION_HIDE: 'NOTIFICATION_HIDE',
  NOTIFICATION_RESET: 'NOTIFICATION_RESET'
}

export const state = () => ({
  isShown: false,
  message: '',
  color: 'error'
})

export const getters = {
  current (state) {
    return {
      isShow: state.isShown,
      message: state.message,
      color: state.color
    }
  }
}

export const actions = {
  show ({ commit }, { type = 'info', message = '' }) {
    if (!['success', 'info', 'error'].includes(type)) {
      return
    }

    const notification = {
      message,
      type
    }
    commit(types.NOTIFICATION_SHOW, notification)
  },

  hide ({ commit }) {
    commit(types.NOTIFICATION_HIDE)

    setTimeout(() => {
      commit(types.NOTIFICATION_RESET)
    }, 500)
  }
}

export const mutations = {
  [types.NOTIFICATION_SHOW] (state, { type, message }) {
    state.message = message
    state.isShown = true
    state.color = type
  },
  [types.NOTIFICATION_HIDE] (state) {
    state.isShown = false
  },
  [types.NOTIFICATION_RESET] (state) {
    state.color = 'info'
    state.message = ''
  }
}
