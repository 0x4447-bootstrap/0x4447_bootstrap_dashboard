import { Auth } from 'aws-amplify'
import { pickBy } from 'lodash'
import AwsClient from '~/services/aws/AWSClient'
import CognitoSyncClient from '~/services/aws/CognitoSync'
import s3Client from '~/services/aws/S3'

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
    const key = (await AwsClient.credentials()).identityId

    const aYearFromNow = new Date()
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1)

    await s3Client.put({
      key,
      file,
      params: {
        CacheControl: 'max-age=31556952',
        Expires: aYearFromNow
      }
    })

    await dispatch('fetchProfilePhoto', { key })
  },

  async fetchProfilePhoto ({ dispatch }) {
    const key = (await AwsClient.credentials()).identityId

    try {
      const profilePictureUrl = await s3Client.getUrl({ key })

      await dispatch('profileStateUpdate', {
        picture: profilePictureUrl
      })

      return profilePictureUrl
    } catch (err) {
      if (err?.statusCode === 403) {
        return // Fail silently, image doesn't exist
      }

      throw err
    }
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

  async settingsSave ({ dispatch }, keyValues) {
    await CognitoSyncClient.updateRecords(keyValues)

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
