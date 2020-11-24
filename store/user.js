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
    picture: ''
  }
})

export const getters = {
  profile (state) {
    return state.profile
  }
}

export const actions = {
  profileSet ({ commit }, { profile }) {
    commit(types.PROFILE_SET, profile)
  },

  async profileUpdate ({ dispatch }, profilePayload) {
    const currentUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(
      currentUser,
      pickBy({
        given_name: profilePayload.givenName,
        family_name: profilePayload.familyName,
        picture: profilePayload.picture
      })
    )

    dispatch('profileStateUpdate', profilePayload)
  },

  async profilePhotoUpdate ({ getters, dispatch }, { file }) {
    const key = `${new Date().getTime()}-${getters.profile.id}-${file.name}`

    const uploadResult = await Storage.put(key, file)
    const photoUrl = await Storage.get(uploadResult.key)

    await dispatch('profileUpdate', {
      picture: photoUrl
    })
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
