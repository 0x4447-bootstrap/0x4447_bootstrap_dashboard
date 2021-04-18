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
      </v-list>

      <v-divider />

      <v-list>
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
          class="ml-5"
          v-on="on"
          @click="onNotificationsMarkRead"
        >
          <v-badge
            :value="hasUnreadNotifications"
            dot
            overlap
            color="red"
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        v-if="hasNotifications"
        class="px-2"
      >
        <template
          v-for="(notification, index) in notifications"
        >
          <v-list-item
            :key="index"
            :class="notification.type"
            class="notifications-list__item"
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
      color="grey darken-1"
    >
      <v-progress-circular
        v-if="avatarLoading"
        key="loading"
        size="30"
        width="2"
        indeterminate
      />

      <v-img
        v-else
        key="avatar"
        :src="profile.picture"
        alt="Profile photo"
        @error="onAvatarImageError"
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

export default {
  name: 'AppToolbar',

  data () {
    return {
      hasUnreadNotifications: false,
      avatarLoading: false
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
          title: this.$routes.profileSecurity.title,
          icon: 'mdi-security',
          route: this.$routes.profileSecurity.route
        },
        {
          title: this.$routes.profileInterface.title,
          icon: 'mdi-brush',
          route: this.$routes.profileInterface.route
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

  watch: {
    notifications (nextValue, prevValue) {
      if (nextValue.length > prevValue.length) {
        this.hasUnreadNotifications = true
      }
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

    onSidebarToggle () {
      this.$emit('sidebar:toggle')
    },

    onNotificationsMarkRead () {
      this.hasUnreadNotifications = false
    },

    // Attempt to load avatar multiple times to cover the case of first user login, when avatar is not yet generated.
    // Loader while be displayed in place
    async onAvatarImageError () {
      const RELOAD_ATTEMPTS = 5
      const RELOAD_TIMEOUT = 1500
      const avatarUrl = this.profile.picture

      this.avatarLoading = true

      // eslint-disable-next-line no-unused-vars
      for (const i of new Array(RELOAD_ATTEMPTS)) {
        const loaded = await this.reloadAvatar(avatarUrl, RELOAD_TIMEOUT)
        if (loaded) {
          this.avatarLoading = false
          break
        }
      }
    },

    reloadAvatar (avatarUrl, timeoutMs = 1500) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const img = new Image()

          img.addEventListener('load', () => {
            resolve(true)
          })

          img.addEventListener('error', () => {
            resolve(false)
          })

          img.src = avatarUrl
        }, timeoutMs)
      })
    }
  }
}
</script>

<style lang="scss">
.notifications-list {
  &__item {
    border-radius: 4px;
  }
}
</style>
