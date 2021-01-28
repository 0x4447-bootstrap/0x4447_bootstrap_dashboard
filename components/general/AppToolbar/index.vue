<template>
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
      <template #activator="{ on }">
        <v-btn
          class="ml-5"
          small
          v-on="on"
        >
          Menu
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

        <v-list-item
          dense
          @click="onSignOut"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      offset-y
    >
      <template #activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </template>

      <v-list
        v-if="hasNotifications"
      >
        <template
          v-for="(notification, index) in notifications"
        >
          <v-list-item
            :key="index"
            :class="notification.type"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title v-html="notification.message" />
              <v-list-item-subtitle v-html="notification.createdOnPretty" />
            </v-list-item-content>
          </v-list-item>

          <v-divider
            :key="`${index}-divider`"
            inset
          />
        </template>
      </v-list>

      <v-sheet
        v-else
        class="pa-5"
      >
        No notifications
      </v-sheet>
    </v-menu>

    <v-avatar
      size="48"
      class="ml-5"
    >
      <v-img
        :lazy-src="avatarPlaceholder"
        :src="profile.picture"
        alt="Profile photo"
      />
    </v-avatar>

    <template
      v-if="showAccountMenu"
      #extension
    >
      <v-tabs class="px-3">
        <v-tabs-slider />

        <v-tab
          v-for="(tab, index) in accountMenu"
          :key="index"
          :to="tab.route"
        >
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { avatarPlaceholder } from '~/assets/images'

export default {
  name: 'AppToolbar',

  data () {
    return {
      avatarPlaceholder
    }
  },

  computed: {
    ...mapState({
      route: 'route'
    }),
    ...mapGetters({
      profile: 'user/profile',
      settings: 'user/settings',
      notifications: 'notifications/history',
      hasNotifications: 'notifications/hasHistory'
    }),

    accountMenu () {
      return [
        {
          title: this.$routes.profileIdentity.title,
          icon: 'mdi-account',
          route: this.$routes.profileIdentity.route
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
      return [
        ...this.accountMenu.map(menuItem => menuItem.route),
        this.$routes.paymentInvoiceId().route
      ].findIndex(menuRoute => menuRoute?.name === routeName) > -1
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
    },

    onSidebarToggle (isOpen) {
      this.$emit('sidebar:toggle')
    }
  }
}
</script>
