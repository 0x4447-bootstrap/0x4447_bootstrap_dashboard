import GeoLocation from '~/services/geolocation/GeoLocation'

const types = {
  COUNTRIES_LIST_SET: 'COUNTRIES_LIST_SET',
  IP_INFO_SET: 'IP_INFO_SET'
}

export const state = () => ({
  company: {
    name: '0x4447'
  },
  countriesList: [],
  ipInfo: {}
})

export const getters = {
  company (state) {
    return state.company
  },

  countries (state) {
    return state.countriesList
  },

  ipInfo (state) {
    return state.ipInfo
  }
}

export const actions = {
  async fetchCountriesList ({ commit }) {
    const countries = await GeoLocation.getCountries()

    commit(types.COUNTRIES_LIST_SET, countries)
  },

  async fetchIpInfo ({ commit }) {
    const ipInfo = await GeoLocation.getIpInfo()

    commit(types.IP_INFO_SET, ipInfo)
  }
}

export const mutations = {
  [types.COUNTRIES_LIST_SET] (state, countries) {
    state.countriesList = countries
  },

  [types.IP_INFO_SET] (state, ipInfo) {
    state.ipInfo = ipInfo
  }
}
