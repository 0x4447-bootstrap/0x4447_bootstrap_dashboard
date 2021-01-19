import { build } from './config/build'
import { buildModules, modules } from './config/modules'
import { css } from './config/css'
import { env } from './config/env'
import { head } from './config/head'
import { loadingIndicator } from './config/loading'
import { plugins } from './config/plugins'
import { privateRuntimeConfig, publicRuntimeConfig } from './config/runtimeConfig'
import { router } from './config/router'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build,

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css,

  // Client-side environmental variables https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-env
  env,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head,

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins,

  // Router customizations https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router
  router,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules,

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules,

  loadingIndicator,

  // Dynamic environmental variables accessible from Nuxt context
  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config
  privateRuntimeConfig,
  publicRuntimeConfig
}
