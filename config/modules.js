export const buildModules = [
  // https://go.nuxtjs.dev/eslint
  '@nuxtjs/eslint-module',
  // https://github.com/nuxt-community/vuetify-module
  ['@nuxtjs/vuetify', {
    customVariables: ['~/assets/styles/_config.scss'],
    treeShake: {
      components: [
        'VProgressCircular'
      ]
    },
    options: {
      customProperties: true
    }
  }],
  ['@nuxt/content', {}]
]

export const modules = [
  ['@nuxtjs/pwa', {
    icon: {
      source: 'static/logo-icon.png'
    }
  }]
]
