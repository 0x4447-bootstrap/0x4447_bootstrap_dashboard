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
        <v-list-item
          v-for="menuItem in navigationMenu"
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        @click.stop="onSidebarToggle"
      />

      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click="onSignOut"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Sing out</span>
      </v-tooltip>
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

export default {
  name: 'LayoutDefault',

  components: {
    AppNotifications
  },

  data () {
    return {
      isSidebarOpen: false
    }
  },

  computed: {
    navigationMenu () {
      return [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          route: this.$routes.dashboard.route
        },
        {
          title: 'Profile',
          icon: 'mdi-account',
          route: this.$routes.profile.route
        },
        {
          title: 'Payment',
          icon: 'mdi-credit-card-outline',
          route: this.$routes.payment.route
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
