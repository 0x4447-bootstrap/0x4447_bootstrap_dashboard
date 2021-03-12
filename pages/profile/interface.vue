<template>
  <v-layout column>
    <page-title
      :title="$routes.profileInterface.title"
      anchor="interface"
    />

    <v-fade-transition
      mode="out-in"
    >
      <progress-content
        v-if="isFetching"
        key="settings-fetching"
      />

      <v-row
        v-else
        key="settings"
      >
        <a-column
          cols="12"
          sm="12"
          md="4"
        >
          <v-card
            width="100%"
          >
            <v-card-text>
              <form
                @submit.prevent="onSave"
              >
                <v-select
                  v-model="interfaceSettings.colorTheme"
                  :items="colorThemes"
                  item-text="label"
                  item-value="value"
                  label="Color theme"
                />

                <v-btn
                  :loading="isLoading"
                  class="mt-5"
                  type="submit"
                  color="primary"
                >
                  Save
                </v-btn>
              </form>
            </v-card-text>
          </v-card>
        </a-column>
      </v-row>
    </v-fade-transition>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProgressContent from '~/components/general/ProgressContent'

export default {
  name: 'ViewProfileInterface',

  components: {
    ProgressContent
  },

  data () {
    return {
      isFetching: false,
      isLoading: false,

      interfaceSettings: {
        colorTheme: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      settings: 'user/settings'
    }),

    colorThemes () {
      return [
        {
          value: 'system',
          label: 'System preference'
        },
        {
          value: 'light',
          label: 'Light'
        },
        {
          value: 'dark',
          label: 'Dark'
        }
      ]
    }
  },

  watch: {
    'interfaceSettings.colorTheme' (colorTheme) {
      this.$vuetify.theme.dark = !colorTheme || colorTheme === 'system' ? window.matchMedia('(prefers-color-scheme: dark)')?.matches : colorTheme === 'dark'
    }
  },

  async beforeMount () {
    this.isFetching = true

    await this.settingsFetch()
    this.setDefaultSettings()

    this.isFetching = false
  },

  methods: {
    ...mapActions({
      settingsFetch: 'user/settingsFetch',
      settingsSave: 'user/settingsSave',
      notificationShow: 'notifications/show'
    }),

    setDefaultSettings () {
      this.interfaceSettings = {
        ...this.interfaceSettings,
        colorTheme: this.settings.colorTheme || 'system'
      }
    },

    async onSave () {
      this.isLoading = true

      try {
        const colorTheme = this.interfaceSettings.colorTheme
        const colorThemeSetting = {
          key: 'colorTheme',
          ...(colorTheme === 'system' ? {
            operation: 'remove'
          } : {
            value: this.interfaceSettings.colorTheme
          })
        }

        await this.settingsSave([
          colorThemeSetting
        ])

        this.notificationShow({
          type: 'success',
          message: 'Interface settings have been updated'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to save interface settings'
        })
      } finally {
        this.isLoading = false
      }
    }
  },

  head () {
    return {
      title: this.$routes.profileInterface.title
    }
  }
}
</script>
