<template>
  <v-snackbar
    v-model="isShownLoader"
    :timeout="-1"
    class="app-loader__container"
    bottom
    app
  >
    <v-progress-circular
      size="22"
      indeterminate
    />
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppLoader',

  computed: {
    ...mapGetters({
      isShown: 'loader/isShown'
    }),

    isShownLoader: {
      get () {
        return this.isShown
      },
      set () {
        this.hide()
      }
    }
  },

  methods: {
    ...mapActions({
      hide: 'loader/hide'
    })
  }
}
</script>

<style lang="scss">
.app-loader__container {
  .v-snack__wrapper {
  }

  .v-snack__content {
    display: flex;
    justify-content: center;
  }

  .v-snack__action {
    display: none;
  }
}
</style>
