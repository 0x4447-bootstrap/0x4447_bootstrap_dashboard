<template>
  <v-layout column>
    <v-card class="red darken-3">
      <v-card-text>
        <div class="layout-error__inner">
          <v-icon
            size="42"
            class="layout-error__icon mb-2"
            v-text="'mdi-information-outline'"
          />

          <h1 class="display-1 mb-5">
            {{ error.message || 'An error occurred' }}
          </h1>

          <p>
            The application has encountered an unexpected error. <br>
            Our team is notified about the issue.
          </p>

          <p>
            <a
              href="#"
              @click.prevent="onRefresh"
            >Refresh</a> the page or return to
            <nuxt-link
              :to="$routes.dashboard.route"
            >
              {{ $routes.dashboard.title }}
            </nuxt-link>
            page
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'LayoutError',

  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    onRefresh () {
      window.location.reload(true)
    }
  }
}
</script>

<style lang="scss">
.layout-error {
  &__inner {
    padding: 120px 0;
    text-align: center;
  }

  &__icon {
    opacity: 0.7;
  }
}
</style>
