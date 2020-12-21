export default function pluginVuetify ({ app }) {
  app.vuetify.framework.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
}
