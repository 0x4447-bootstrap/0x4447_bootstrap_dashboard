<template>
  <v-snackbar
    v-model="isShownNotification"
    :timeout="3000"
    :color="notification.color"
    app
  >
    <p class="mb-0 text-center font-weight-bold">
      {{ notification.message }}
    </p>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppNotifications',

  computed: {
    ...mapGetters({
      notification: 'notifications/current'
    }),

    isShownNotification: {
      get () {
        return this.notification.isShow
      },
      set () {
        this.hide()
      }
    }
  },

  methods: {
    ...mapActions({
      hide: 'notifications/hide'
    })
  }
}
</script>

<style scoped>
</style>
