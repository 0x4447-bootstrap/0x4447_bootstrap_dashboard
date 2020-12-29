export const buildModules = [
  // https://go.nuxtjs.dev/eslint
  '@nuxtjs/eslint-module',
  // https://github.com/nuxt-community/vuetify-module
  '@nuxtjs/vuetify'
  // https://go.nuxtjs.dev/pwa
]

export const modules = [
  ['@nuxtjs/pwa', {
    icon: {
      source: 'static/logo-icon.png'
    }
  }]
]
