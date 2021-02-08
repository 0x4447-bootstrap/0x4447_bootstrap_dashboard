import axios from 'axios'

export default class GeoLocation {
  static async getCountries () {
    const { data } = await axios.get('/data/countries.json')

    return data
  }
}
