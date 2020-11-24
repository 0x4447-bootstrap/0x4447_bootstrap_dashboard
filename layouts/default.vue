<template>
  <div>
    <nav>
      <nuxt-link :to="$routes.dashboard.route">
        Dashboard
      </nuxt-link>
      <nuxt-link :to="$routes.profile.route">
        Profile
      </nuxt-link>
      <nuxt-link :to="$routes.payment.route">
        Payment
      </nuxt-link>
      <a
        :href="$router.resolve($routes.auth.route).href"
        @click.prevent="onSignOut"
      >
        Sign out
      </a>
    </nav>

    <nuxt />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LayoutDefault',

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
