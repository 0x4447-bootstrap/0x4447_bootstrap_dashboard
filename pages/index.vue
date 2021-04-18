<template>
  <v-layout column>
    <page-title
      :title="$routes.dashboard.title"
      anchor="home"
    />

    <v-row>
      <a-column
        sm="12"
      >
        <v-card>
          <v-card-text>
            <div class="text-h5">
              Welcome!
            </div>

            <v-btn
              :loading="isLoading"
              class="mt-5"
              @click="onSave"
            >
              Save
            </v-btn>
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ViewDashboard',

  data () {
    return {
      isLoading: false
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show',
      subscriptionCheck: 'payment/subscriptionCheck',
      setOpenModalSubscription: 'payment/setOpenModalSubscription'
    }),

    async onSave () {
      try {
        this.isLoading = true

        const { isSubscribed } = await this.subscriptionCheck()

        if (!isSubscribed) {
          return this.setOpenModalSubscription(true)
        }

        this.notificationShow({
          type: 'success',
          message: 'Saved!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to perform save'
        })

        throw err
      } finally {
        this.isLoading = false
      }
    }
  },

  head () {
    return {
      title: this.$routes.dashboard.title
    }
  }
}
</script>
