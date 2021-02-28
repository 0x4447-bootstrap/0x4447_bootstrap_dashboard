import { Auth } from 'aws-amplify'
import AwsClient from '~/services/aws/AWSClient'

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
    try {
      const user = await Auth.currentUserInfo()

      if (!user) {
        return dispatch('setAuthState', {
          isLoggedIn: false
        })
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
        dispatch('user/fetchProfilePhoto', {}, { root: true }),
        dispatch('user/settingsFetch', {}, { root: true })
      ])
    } catch (err) {
      dispatch('setAuthState', {
        isLoggedIn: false
      })

      // eslint-disable-next-line no-console
      console.error(err)
    }
  },

  async userRecordGet () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Item } = await dbClient.get({
      TableName: 'profile',
      Key: {
        pk: identityId,
        sk: 'basic'
      }
    }).promise()

    return Item
  },

  async createUserRecord (store, {
    sub,
    email
  }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const documentPayload = {
      pk: identityId,
      sk: 'basic',
      sub,
      email
    }

    await dbClient.put({
      TableName: 'profile',
      Item: documentPayload
    }).promise()
  },

  setAuthState ({ commit }, { isLoggedIn = false }) {
    commit(types.AUTH_SET, {
      isLoggedIn
    })
  },

  async signOut ({ commit }) {
    await Auth.signOut()

    AwsClient.destroyInstance()
    localStorage.clear()

    commit(types.AUTH_SET, {
      isLoggedIn: false
    })
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
