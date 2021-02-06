import axios from 'axios'

export default class GeoLocation {
  static async getCountries () {
    const { data } = await axios.get('/data/countries.json')

    return data
  }

  static async getIpInfo () {
    const { data } = await axios.get('http://ip-api.com/json')

    return {
      as: data.as, // address line
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon,
      org: data.org,
      query: data.query,
      region: data.region,
      regionName: data.regionName,
      status: data.status,
      timezone: data.timezone,
      zip: data.zip
    }
  }
}
