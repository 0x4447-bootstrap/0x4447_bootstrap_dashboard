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
    familyName: '',
    picture: '',
    // It is currently stored as JSON string in Cognito and requires parsing before saving to Cognito
    address: {
      city: '',
      country: '',
      postalCode: '',
      state: '',
      streetAddress: ''
    }
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
      givenName,
      familyName,
      address
    } = state.profile
    return !givenName || !familyName || !address ||
      Object.values(address).every(addressField => !addressField)
  },

  settings (state) {
    return state.settings
  }
}

export const actions = {
  profileSet ({ commit }, { profile }) {
    commit(types.PROFILE_SET, {
      ...profile,
      address: profile.address ? JSON.parse(profile.address) : {}
    })
  },

  async profileUpdate ({ dispatch }, profilePayload) {
    const currentUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(
      currentUser,
      pickBy({
        email: profilePayload.email,
        given_name: profilePayload.givenName,
        family_name: profilePayload.familyName,
        picture: profilePayload.picture,
        address: JSON.stringify(profilePayload.address)
      })
    )

    dispatch('profileStateUpdate', profilePayload)
  },

  async profilePhotoUpdate ({
    getters,
    dispatch
  }, { file }) {
    const key = getters.profile.id

    await Storage.put(key, file)
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
