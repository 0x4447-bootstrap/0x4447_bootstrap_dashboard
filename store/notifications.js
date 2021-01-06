import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const types = {
  NOTIFICATION_SHOW: 'NOTIFICATION_SHOW',
  NOTIFICATION_HIDE: 'NOTIFICATION_HIDE',
  NOTIFICATION_RESET: 'NOTIFICATION_RESET',
  NOTIFICATION_HISTORY_APPEND: 'NOTIFICATION_HISTORY_APPEND'
}

export const state = () => ({
  isShown: false,
  message: '',
  color: 'error',

  history: []
})

export const getters = {
  current (state) {
    return {
      isShow: state.isShown,
      message: state.message,
      color: state.color
    }
  },

  history (state) {
    return state.history.slice(0, 10).map(notification => ({
      ...notification,
      createdOnPretty: `${formatDistanceToNow(notification.createdAt)} ago`
    }))
  },

  hasHistory (state) {
    return state.history.length > 0
  }
}

export const actions = {
  show ({ commit }, { type = 'info', message = '' }) {
    if (!['success', 'info', 'error'].includes(type)) {
      return
    }

    const notification = {
      message,
      type,
      createdAt: new Date()
    }
    commit(types.NOTIFICATION_SHOW, notification)
    commit(types.NOTIFICATION_HISTORY_APPEND, notification)
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
  },

  [types.NOTIFICATION_HISTORY_APPEND] (state, notification) {
    state.history = [
      notification,
      ...state.history
    ]
  }
}
