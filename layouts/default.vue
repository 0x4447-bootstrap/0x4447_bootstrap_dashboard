<template>
  <v-app>
    <v-navigation-drawer
      v-model="isSidebarOpen"
      :mini-variant="isSidebarMinimized"
      mini-variant-width="64"
      app
    >
      <div class="navbar__logo">
        <router-link
          :to="$routes.dashboard.route"
          class="navbar__logo__link"
        >
          <v-fade-transition
            mode="out-in"
          >
            <img
              :key="logoImage"
              :src="logoImage"
              class="navbar__logo__image"
              alt="Logo"
            >
          </v-fade-transition>
        </router-link>
      </div>

      <v-divider />

      <v-list
        dense
        nav
      >
        <template
          v-for="(menuItem, index) in navigationMenu"
        >
          <v-divider
            v-if="menuItem.divider"
            :key="index"
            class="my-2"
          />

          <v-list-item
            v-else-if="!menuItem.subNav"
            :key="menuItem.title"
            :to="menuItem.route"
            exact
            link
          >
            <v-list-item-icon>
              <v-icon>{{ menuItem.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-else
            :key="menuItem.title"
            :prepend-icon="menuItem.icon"
          >
            <template #activator>
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="subMenuItem in menuItem.subNav"
              :key="subMenuItem.title"
              :to="subMenuItem.route"
              exact
              link
            >
              <v-list-item-title v-text="subMenuItem.title" />

              <v-list-item-icon>
                <v-icon v-text="subMenuItem.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <template
        #append
      >
        <v-fade-transition
          mode="out-in"
          hide-on-leave
        >
          <div
            v-if="isSidebarFooterVisible"
            class="sidebar-footer__container"
          >
            <v-divider />

            <div class="sidebar-footer__inner">
              <div class="sidebar-footer__links">
                <a
                  class="sidebar-footer__link grey--text"
                  href="/docs/privacy-policy.pdf"
                  target="_blank"
                >
                  Privacy Policy
                </a>

                <a
                  class="sidebar-footer__link grey--text"
                  href="/docs/terms-of-service.pdf"
                  target="_blank"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            <div class="sidebar-footer__copyright grey--text text-center">
              Est.2016, Copr.0x4447™ LLC.
            </div>
          </div>
        </v-fade-transition>

        <div
          v-if="isSidebarMinimized"
          class="sidebar-footer-minimized__container"
        >
          <a
            href="#"
            class="sidebar-footer-minimized__logo grey--text text--darken-2"
            @click.prevent="onSidebarToggle"
          >
            {{ company.name }}
          </a>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
    >
      <v-app-bar-nav-icon
        @click.stop="onSidebarToggle"
      />

      <v-spacer class="d-lg-none" />

      <v-spacer />

      <v-menu
        bottom
        left
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-avatar
              size="48"
            >
              <span
                v-if="!profile.picture"
                class="white--text headline"
              >
                {{ profile.givenName }} {{ profile.familyName }}
              </span>

              <img
                v-else
                :src="profile.picture"
                alt="Profile picture"
              >
            </v-avatar>
          </v-btn>
        </template>

        <v-list
          dense
        >
          <v-list-item
            v-for="menuItem in accountMenu"
            :key="menuItem.title"
            :to="menuItem.route"
            link
            exact
            dense
          >
            <v-list-item-icon>
              <v-icon>{{ menuItem.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        class="ml-5"
        small
        @click="onSignOut"
      >
        Sign out
      </v-btn>

      <template
        v-if="showAccountMenu"
        #extension
      >
        <v-tabs
          align-with-title
        >
          <v-tabs-slider />

          <v-tab
            v-for="(tab, index) in accountMenu"
            :key="index"
            :to="tab.route"
            exact
          >
            {{ tab.title }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

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
import { mapState, mapGetters, mapActions } from 'vuex'
import AppNotifications from '~/components/general/AppNotifications'
import { logo, logoDark, logoSquare, logoSquareDark } from '~/assets/images'

const logosMap = new Map([
  ['light-expanded', logo],
  ['dark-expanded', logoDark],
  ['light-minimized', logoSquare],
  ['dark-minimized', logoSquareDark]
])

export default {
  name: 'LayoutDefault',

  components: {
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
    ...mapState({
      route: 'route'
    }),
    ...mapGetters({
      profile: 'user/profile',
      company: 'app/company'
    }),

    logoImage () {
      const isDarkMode = this.$vuetify.theme.dark
      const isMinimized = this.isSidebarMinimized

      const logoSetting = [
        `${isDarkMode ? 'dark' : 'light'}`,
        `${isMinimized ? 'minimized' : 'expanded'}`
      ].join('-')

      return logosMap.get(logoSetting)
    },

    navigationMenu () {
      return [
        {
          title: 'Home',
          icon: 'mdi-view-dashboard',
          route: this.$routes.dashboard.route
        },
        {
          divider: true
        },
        {
          title: this.$routes.help.title,
          icon: 'mdi-help',
          route: this.$routes.help.route
        }
      ]
    },

    accountMenu () {
      return [
        {
          title: this.$routes.profileIdentity.title,
          icon: 'mdi-account',
          route: this.$routes.profileIdentity.route
        },
        {
          title: this.$routes.profileAddress.title,
          icon: 'mdi-home',
          route: this.$routes.profileAddress.route
        },
        {
          title: this.$routes.payment.title,
          icon: 'mdi-credit-card-plus-outline',
          route: this.$routes.payment.route
        },
        {
          title: this.$routes.paymentInvoices.title,
          icon: 'mdi-receipt',
          route: this.$routes.paymentInvoices.route
        }
      ]
    },

    showAccountMenu () {
      const routeName = this.route.name
      return this.accountMenu.findIndex(menuItem => menuItem.route?.name === routeName) > -1
    }
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
    this.listenColorThemeChange()

    if (this.$vuetify.breakpoint.lgAndUp) {
      this.isSidebarOpen = true
    }
  },

  methods: {
    ...mapActions({
      signOut: 'auth/signOut'
    }),

    onSidebarToggle () {
      if (this.$vuetify.breakpoint.lgAndUp) {
        this.isSidebarMinimized = !this.isSidebarMinimized
      } else {
        this.isSidebarOpen = !this.isSidebarOpen
      }
    },

    async onSignOut () {
      try {
        await this.signOut()
        await this.$router.replace(this.$routes.auth.route)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        // TODO handle error
        throw err
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
      background-color: rgba(0, 0, 0, 0.12);
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
