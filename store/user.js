import { Auth, Storage } from 'aws-amplify'
import { pickBy } from 'lodash'

const types = {
  PROFILE_SET: 'PROFILE_SET',
  PROFILE_UPDATE: 'PROFILE_UPDATE'
}

export const state = () => ({
  profile: {
    id: '',
    email: '',
    givenName: '',
    familyName: '',
    picture: '',
    address: '' // It is currently stored as JSON string in Cognito and requires parsing before saving
  }
})

export const getters = {
  profile (state) {
    return state.profile
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
        given_name: profilePayload.givenName,
        family_name: profilePayload.familyName,
        picture: profilePayload.picture,
        address: JSON.stringify(profilePayload.address)
      })
    )

    dispatch('profileStateUpdate', profilePayload)
  },

  async profilePhotoUpdate ({ getters, dispatch }, { file }) {
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
  }
}
