<template>
  <v-app>
    <app-sidebar
      :is-open="isSidebarOpen"
      :is-minimized="isSidebarMinimized"
      :is-footer-visible="isSidebarFooterVisible"
      @update:is-open="onSidebarToggle"
    />

    <app-toolbar
      @sidebar:toggle="onSidebarToggle"
    />

    <v-main>
      <v-container fluid>
        <v-fade-transition>
          <nuxt />
        </v-fade-transition>
      </v-container>
    </v-main>

    <app-notifications />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppSidebar from '~/components/general/AppSidebar'
import AppToolbar from '~/components/general/AppToolbar'
import AppNotifications from '~/components/general/AppNotifications'

export default {
  name: 'LayoutDefault',

  components: {
    AppSidebar,
    AppToolbar,
    AppNotifications
  },

  data () {
    return {
      isSidebarOpen: false,
      isSidebarMinimized: false,
      isSidebarFooterVisible: true
    }
  },

  computed: {
    ...mapGetters({
      settings: 'user/settings',
      hasNotifications: 'notifications/hasHistory'
    })
  },

  watch: {
    '$vuetify.breakpoint.lgAndUp' (nextValue) {
      if (!nextValue) {
        this.isSidebarMinimized = false
      }
    },

    isSidebarMinimized (isMinimized) {
      if (isMinimized) {
        this.isSidebarFooterVisible = false
      } else {
        setTimeout(() => {
          this.isSidebarFooterVisible = !isMinimized
        }, 300)
      }
    }
  },

  beforeMount () {
    const preferredColorTheme = this.settings.colorTheme

    if (!preferredColorTheme) {
      this.listenColorThemeChange()
    } else {
      this.$vuetify.theme.dark = preferredColorTheme === 'dark'
    }

    if (this.$vuetify.breakpoint.lgAndUp) {
      this.isSidebarOpen = true
    }

    this.isSidebarMinimized = this.settings.sidebarMinimized
  },

  methods: {
    ...mapActions({
      settingsFetch: 'user/settingsFetch',
      settingsSave: 'user/settingsSave'
    }),

    toggleSidebarMinimized (value = false) {
      this.isSidebarMinimized = value

      this.settingsSave([
        {
          key: 'sidebarMinimized',
          value
        }
      ])
    },

    onSidebarToggle () {
      if (this.$vuetify.breakpoint.lgAndUp) {
        this.toggleSidebarMinimized(!this.isSidebarMinimized)
      } else {
        this.isSidebarOpen = !this.isSidebarOpen
      }
    },

    listenColorThemeChange () {
      const setAppColorScheme = (mediaQuery) => {
        this.$vuetify.theme.dark = mediaQuery?.matches
      }

      const media = window.matchMedia('(prefers-color-scheme: dark)')

      if (!media) {
        return
      }

      setAppColorScheme(media)

      if (media.addEventListener) {
        media.addEventListener('change', setAppColorScheme)
      } else {
        media.addListener(setAppColorScheme)
      }
    }
  }
}
</script>

<style lang="scss">
.navbar {
  &__logo {
    height: 64px;
    padding: 8px;
    display: flex;
    justify-content: center;
  }

  &__logo__link {
    display: flex;
    justify-content: center;
  }

  &__logo__image {
    width: 100%;
    object-fit: contain;
  }
}

.sidebar-footer {
  &__container {

  }

  &__inner {
    padding: 1rem 1rem 0;
    font-size: 12px;
  }

  &__links {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-around;
  }

  &__link {
    position: relative;
    flex-grow: 1;
    display: flex;
    justify-content: center;

    &:after {
      content: '';
      position: absolute;
      right: 0;
      width: 1px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.12);
    }

    &:last-child {
      &:after {
        display: none;
      }
    }
  }

  &__copyright {
    margin-bottom: 1rem;
  }
}

.sidebar-footer-minimized {
  &__container {
    position: relative;
  }

  &__logo {
    position: absolute;
    left: 50%;
    bottom: 20px;
    writing-mode: tb-rl;
    transform: rotate(-180deg) translateX(50%);
    font-size: 2.2rem;
    text-decoration: none;
    user-select: none;
  }
}
</style>
