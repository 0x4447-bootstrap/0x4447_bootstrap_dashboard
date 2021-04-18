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
      avatarLoading: false,
      avatar: 'https://documentreport-production-us-east-1-profile-photo.s3.amazonaws.com/us-east-1%3Aa13a6979-2aac-484f-9166-bcd3857ce26b?AWSAccessKeyId=ASIATXYZMZKR6NY3UF6I&Expires=1618741113&Signature=GZBJePVCYNRWthfKVcEP%2BvGkuyc%3D&response-cache-control=public&response-content-type=image%2Fpng&response-expires=2022-04-18T10%3A03%3A33Z&x-amz-security-token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIE3xFCSK3Faj12ZrzTPhwwuthPfKy6RuwA8STm4eU0rSAiBvqjTfM3Qo2jShYP2Nu14QgDBK4ZoqpbJOzVlVd9twzyrEBAhbEAIaDDI1NzIxNDQzMzk1NSIMtUDD0sePE6GDH%2FLMKqEEoGNKF6Q%2BUAcLAWrJRR5yDsLju9f%2BcOpaX3HkjG1TvqDmR%2F2CfBzbJ3MLgZ4R1xWurMUU6ma2MHFxE%2BApeyAFojRtGuPGw%2Feh7bXotBHDWDY7zZo%2BGxfaCyMuw2ASHDzHa0%2BL%2FaDsAViiF0uWHAtf9kAO9yqW%2BYCi2KKHFEq9g68SvGEWCSYHhL%2BKEtUobBI3CTBDKf1UTHELGSa5ttu7MzbeKj6jDRIRHOS9K8jIIIbLp1wed7hAEMYLTti0eXT5ZA3gMsuqglfAK1G6Kl18Ev4vmG5vPs6FT8VGOiFZrU2FfsAO9m7Z8cba%2FPFRD1DbqEBAQVvZGfJct43sHLYe0v2uzc1tTr1ENBTkjW764cz%2B9swXnXsUNIsWiGsy4HbZjdRUq4qci2E%2Bji5lPr%2BZfwZXxc7jnt9waBsYJuIlJWghqSdNdTtJuIUBzdfbV5vN%2B%2Fo0PFauHh6wfxu5AoTdds%2Br2S95iL1U3JLG1nN5InwFOlvce9WqmU7OpWtpYCtV37qOk5uPDH20%2B2GSLliGsAtI1JYA0KN0O%2Fc8Yu4YMSOaLINx3XHgRbnncfZcta6ixBasSXW7u9xuK7zfpQA3Crw2Ixwj8kbgAplz2EWy8s4JQBLHcyZE7G9i1xBxxOPEEo3lYWqh%2BbT%2FpLIvybFkPM2DzJ%2BHAzf6whJ1kPc5neD9nnG9M61tpPIeKevH0mvT3PuqXXU0snSzMe5g7zckA7Iw9IfwgwY6hgIIVc32S3efL6%2Fc%2B0d07T9jGtB4tFLLPlNbPcOF5lEYXQkRcLteOBQYOmhAnkPEOIdlWJRG5h8IdMLxT%2FyYI5NeGev566N1mHmLPZZDl9ygYTbVSYT0dW%2FmxZYmakBTzJe3bFqZdolIWN6YXRL%2BNiBo41Y54d%2BmuGMzFxlgcMg15WkLfFI%2FSh0H7e1O8QBZdyerYHuhQhsmlcYKrEbdRVEJr4hFi3JWKDXOJ2mGGsjwmaQLfndedPBgFfLN%2B5Hh0%2F78T5ovf%2FeNFtYvEvcHFikA7wpC9QJuRcGoxkuZljy0QJhdRm4uTrSmBcK5JpwEWCyZUYuS9E%2F9wp80Wr0Y5A8Urd8DKqbZ11111'
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
