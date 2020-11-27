<template>
  <v-app>
    <v-navigation-drawer
      app
      permanent
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
    />

    <v-main>
      <v-container fluid>
        <nuxt />
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

  methods: {
    ...mapActions({
      signOut: 'auth/signOut'
    }),

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
