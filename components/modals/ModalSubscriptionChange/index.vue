<template>
  <v-dialog
    :value="isOpen"
    max-width="480"
    @input="setIsOpen"
  >
    <form
      @submit.prevent="onSubmit"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure?
        </v-card-title>

        <v-card-text>
          <div class="py-6 text-center">
            <p>
              You are about change your subscription plan to:
            </p>

            <div class="mb-3 text-h5">
              {{ plan.label }}
            </div>

            <div class="text-h5">
              {{ plan.priceLabel }}
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>

          <v-spacer />

          <v-btn
            :loading="isLoading"
            color="primary"
            type="submit"
            text
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ModalSubscriptionChange',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },

    plan: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'user/profile'
    })
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show',
      subscriptionPriceUpdate: 'payment/subscriptionPriceUpdate'
    }),

    setIsOpen (value = false) {
      this.$emit('update:is-open', value)
    },

    onCancel () {
      this.setIsOpen(false)
    },

    async onSubmit () {
      this.isLoading = true
      const priceId = this.plan.id

      try {
        await this.subscriptionPriceUpdate({
          priceId
        })

        this.$emit('subscription:updated', priceId)

        this.notificationShow({
          type: 'success',
          message: 'Subscription plan has been changed!'
        })

        this.setIsOpen(false)
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to change subscription plan'
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
