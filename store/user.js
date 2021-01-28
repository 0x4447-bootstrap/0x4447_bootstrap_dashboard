import { Auth, Storage } from 'aws-amplify'
import { pickBy } from 'lodash'
import CognitoSyncClient from '~/services/aws/CognitoSync'

const types = {
  PROFILE_SET: 'PROFILE_SET',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  SETTINGS_SET: 'SETTINGS_SET'
}

export const state = () => ({
  profile: {
    id: '',
    email: '',
    givenName: '',
    picture: ''
  },

  settings: {
    sidebarMinimized: false
  }
})

export const getters = {
  profile (state) {
    return state.profile
  },

  /**
   * Check if profile fields haven't been updated yet
   * @returns {*}
   */
  isProfileEmpty (state) {
    const {
      givenName
    } = state.profile
    return !givenName
  },

  settings (state) {
    return state.settings
  }
}

export const actions = {
  profileSet ({ commit }, { profile }) {
    commit(types.PROFILE_SET, {
      ...profile
    })
  },

  async profileUpdate ({ dispatch }, profilePayload) {
    const currentUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(
      currentUser,
      pickBy({
        email: profilePayload.email,
        given_name: profilePayload.givenName,
        picture: profilePayload.picture
      })
    )

    dispatch('profileStateUpdate', profilePayload)
  },

  async profilePhotoUpdate ({
    getters,
    dispatch
  }, { file }) {
    const key = (await Auth.currentCredentials()).identityId

    await Storage.put(key, file, {
      cacheControl: 'public, max-age=365000000',
      contentType: file.type
    })
    await dispatch('fetchProfilePhoto', { key })
  },

  async fetchProfilePhoto ({ dispatch }, { key }) {
    const profilePictureUrl = await Storage.get(key)

    await dispatch('profileStateUpdate', {
      picture: profilePictureUrl
    })

    return profilePictureUrl
  },

  profileStateUpdate ({ commit }, updatedFields) {
    commit(types.PROFILE_UPDATE, updatedFields)
  },

  async settingsFetch ({ commit }) {
    const records = await CognitoSyncClient.getRecords({
      datasetName: 'settings_dashboard'
    })

    const settings = CognitoSyncClient.parseCognitoSyncRecords(records)

    commit(types.SETTINGS_SET, settings)
  },

  async settingsSave ({ dispatch }, { key, value }) {
    await CognitoSyncClient.updateRecords({ key, value })

    await dispatch('settingsFetch')
  },

  async passwordChange (context, { current: currentPassword, new: newPassword }) {
    const user = await Auth.currentAuthenticatedUser()
    return Auth.changePassword(
      user,
      currentPassword,
      newPassword
    )
  }
}

export const mutations = {
  [types.PROFILE_SET] (state, profile) {
    state.profile = {
      ...profile
    }
  },

  [types.PROFILE_UPDATE] (state, updatedProfile = {}) {
    state.profile = {
      ...state.profile,
      ...updatedProfile
    }
  },

  [types.SETTINGS_SET] (state, settings) {
    state.settings = { ...settings }
  }
}
