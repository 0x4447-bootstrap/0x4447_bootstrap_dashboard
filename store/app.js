import GeoLocation from '~/services/geolocation/GeoLocation'

const types = {
  COUNTRIES_LIST_SET: 'COUNTRIES_LIST_SET',
  IP_INFO_SET: 'IP_INFO_SET'
}

export const state = () => ({
  company: {
    name: '0x4447'
  },
  countriesList: []
})

export const getters = {
  company (state) {
    return state.company
  },

  countries (state) {
    return state.countriesList
  },

  countryByTimezone: state => (timezone) => {
    return state.countriesList.find(country => country.timezones?.includes(timezone))
  }
}

export const actions = {
  async fetchCountriesList ({ commit }) {
    const countries = await GeoLocation.getCountries()

    commit(types.COUNTRIES_LIST_SET, countries)
  }
}

export const mutations = {
  [types.COUNTRIES_LIST_SET] (state, countries) {
    state.countriesList = countries
  }
}
