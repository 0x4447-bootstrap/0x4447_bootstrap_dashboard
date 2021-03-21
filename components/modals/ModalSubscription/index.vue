<template>
  <v-dialog
    :value="isOpen"
    max-width="480"
    @input="setIsOpen"
  >
    <v-card>
      <v-card-text>
        <div class="py-6">
          <p class="text-center">
            Active subscription is required to complete this action. <br>
            Would you like to subscribe now?
          </p>
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
          color="primary"
          type="submit"
          text
          @click="onSubscribe"
        >
          Subscribe
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ModalSubscription',

  data () {
    return {
      isOpen: false
    }
  },

  computed: {
    ...mapGetters({
      isOpenModalSubscription: 'payment/isOpenModalSubscription'
    })
  },

  watch: {
    isOpenModalSubscription (isOpen) {
      this.isOpen = isOpen
    }
  },

  methods: {
    ...mapActions({
      setOpenModalSubscription: 'payment/setOpenModalSubscription'
    }),

    setIsOpen (isOpen = false) {
      this.setOpenModalSubscription(isOpen)
    },

    onCancel () {
      this.setIsOpen(false)
    },

    onSubscribe () {
      this.$router.push(this.$routes.payment.route)
      this.setIsOpen(false)
    }
  }
}
</script>
