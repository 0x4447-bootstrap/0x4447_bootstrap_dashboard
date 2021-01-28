<template>
  <v-navigation-drawer
    :value="isOpen"
    :mini-variant="isMinimized"
    mini-variant-width="64"
    app
    @input="onSidebarToggle"
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
            :key="logoImage.src"
            :src="logoImage.src"
            :srcset="logoImage.srcset"
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
          v-if="isFooterVisible"
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
        v-if="isMinimized"
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
</template>

<script>
import { mapGetters } from 'vuex'
import {
  logo,
  logo2x,
  logoDark,
  logoDark2x,
  logoSquare,
  logoSquare2x,
  logoSquareDark,
  logoSquareDark2x
} from '~/assets/images'

const logosMap = new Map([
  ['light-expanded', [logo, logo2x]],
  ['dark-expanded', [logoDark, logoDark2x]],
  ['light-minimized', [logoSquare, logoSquare2x]],
  ['dark-minimized', [logoSquareDark, logoSquareDark2x]]
])

export default {
  name: 'ASidebar',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    isMinimized: {
      type: Boolean,
      default: false
    },
    isFooterVisible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      company: 'app/company'
    }),

    logoImage () {
      const isDarkMode = this.$vuetify.theme.dark
      const isMinimized = this.isMinimized

      const logoSetting = [
        `${isDarkMode ? 'dark' : 'light'}`,
        `${isMinimized ? 'minimized' : 'expanded'}`
      ].join('-')

      const logos = logosMap.get(logoSetting)

      return {
        src: logos[0],
        srcset: `${logos[0]} 1x, ${logos[1]} 2x`
      }
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
        },
        {
          title: this.$routes.support.title,
          icon: 'mdi-lifebuoy',
          route: this.$routes.support.route
        }
      ]
    }
  },

  methods: {
    onSidebarToggle (isOpen) {
      if (isOpen !== this.isOpen) {
        this.$emit('update:is-open')
      }
    }
  }
}
</script>
