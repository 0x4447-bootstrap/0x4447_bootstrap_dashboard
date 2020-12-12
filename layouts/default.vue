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
        <v-divider />
        <div class="sidebar-footer__container">
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

          <div class="sidebar-footer__copyright grey--text text-center">
            Est.2016, Copr.0x4447™ LLC.
          </div>
        </div>

        <v-divider
          class="py-3"
        />
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
              title: 'Identity',
              icon: 'mdi-account',
              route: this.$routes.profileIdentity.route
            },
            {
              title: 'Address',
              icon: 'mdi-home',
              route: this.$routes.profileAddress.route
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

<style lang="scss">
.sidebar-footer {
  &__container {
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
</style>
