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
          familyName: user.attributes.family_name,
          address: user.attributes.address
        }
      }, { root: true }),
      dispatch('user/fetchProfilePhoto', {
        key: user.attributes.sub
      }, { root: true }),
      dispatch('user/settingsFetch', {}, { root: true })
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
  },

  /**
   * Send confirmation code to user email
   * @returns {Promise<void>}
   */
  async emailVerificationRequest () {
    const user = await Auth.currentUserPoolUser()
    await Auth.verifyUserAttribute(user, 'email')
  },

  /**
   * Submit email confirmation code to verify user's email
   * @param store
   * @param code {String}
   * @returns {Promise<void>}
   */
  async emailVerificationConfirm (store, { code }) {
    await Auth.verifyCurrentUserAttributeSubmit('email', code)
  }
}

export const mutations = {
  [types.AUTH_SET] (state, { isLoggedIn }) {
    state.isLoggedIn = isLoggedIn
  }
}
