import { Auth } from 'aws-amplify'

const types = {
  AUTH_SET: 'AUTH_SET'
}

export const state = () => ({
  isLoggedIn: false
})

export const getters = {
  isLoggedIn (state) {
    return state.isLoggedIn
  }
}

export const actions = {
  async checkUserAuthentication ({ dispatch }) {
    const user = await Auth.currentUserInfo()

    if (!user) {
      return
    }

    await Promise.all([
      dispatch('setAuthState', {
        isLoggedIn: true
      }),
      dispatch('user/profileSet', {
        profile: {
          id: user.attributes.sub,
          email: user.attributes.email,
          givenName: user.attributes.given_name,
          familyName: user.attributes.family_name
        }
      }, { root: true }),
      dispatch('user/fetchProfilePhoto', {
        key: user.attributes.sub
      }, { root: true })
    ])
  },

  setAuthState ({ commit }, { isLoggedIn = false }) {
    commit(types.AUTH_SET, {
      isLoggedIn
    })
  },

  async signOut ({ commit }) {
    await Auth.signOut()
    commit(types.AUTH_SET, {
      isLoggedIn: false
    })

    // TODO reset user profile
  }
}

export const mutations = {
  [types.AUTH_SET] (state, { isLoggedIn }) {
    state.isLoggedIn = isLoggedIn
  }
}
