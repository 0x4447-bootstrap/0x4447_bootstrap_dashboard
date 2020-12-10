<template>
  <v-app>
    <v-navigation-drawer
      v-model="isSidebarOpen"
      app
      clipped
    >
      <v-list
        dense
        nav
      >
        <template
          v-for="menuItem in navigationMenu"
        >
          <v-list-item
            v-if="!menuItem.subNav"
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

      <template #append>
        <v-list
          dense
        >
          <v-list-item
            href="#"
            link
          >
            <v-list-item-content>
              <v-list-item-title class="text-center">
                Privacy Policy <v-icon small>mdi-open-in-new</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            href="#"
            link
          >
            <v-list-item-content>
              <v-list-item-title class="text-center">
                Terms of Service <v-icon small>mdi-open-in-new</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-center">
                Est.2016, Copr.0x4447™ LLC.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        class="d-lg-none"
        @click.stop="onSidebarToggle"
      />

      <v-spacer class="d-lg-none" />

      <router-link
        :to="$routes.dashboard.route"
        class="d-flex py-1"
        style="height: 100%;"
      >
        <img
          :src="logoImage"
          height="100%"
          alt="Logo"
        >
      </router-link>

      <v-spacer />

      <v-btn
        small
        @click="onSignOut"
      >
        Sign out
      </v-btn>
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
import { mapActions } from 'vuex'
import AppNotifications from '~/components/general/AppNotifications'
import { logo } from '~/assets/images'

export default {
  name: 'LayoutDefault',

  components: {
    AppNotifications
  },

  data () {
    return {
      isSidebarOpen: false,

      logoImage: logo
    }
  },

  computed: {
    navigationMenu () {
      return [
        {
          title: 'Home',
          icon: 'mdi-view-dashboard',
          route: this.$routes.dashboard.route
        },
        {
          title: 'Settings',
          icon: 'mdi-cog',
          subNav: [
            {
              title: 'Profile',
              icon: 'mdi-account',
              route: this.$routes.profile.route
            },
            {
              title: 'Payment method',
              icon: 'mdi-credit-card-plus-outline',
              route: this.$routes.payment.route
            },
            {
              title: 'Invoices',
              icon: 'mdi-receipt',
              route: this.$routes.paymentInvoices.route
            }
          ]
        }
      ]
    }
  },

  beforeMount () {
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.isSidebarOpen = true
    }
  },

  methods: {
    ...mapActions({
      signOut: 'auth/signOut'
    }),

    onSidebarToggle () {
      this.isSidebarOpen = !this.isSidebarOpen
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
    }
  }
}
</script>
