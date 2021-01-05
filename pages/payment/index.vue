<template>
  <v-layout column>
    <v-fade-transition
      mode="out-in"
    >
      <div
        v-if="isFetching"
        key="payment-fetching"
        class="text-center py-5"
      >
        <v-progress-circular
          :size="48"
          :width="5"
          color="primary"
          indeterminate
        />
      </div>

      <div
        v-else-if="hasPaymentMethod"
        key="payment-details"
      >
        <h1 class="display-1 mb-3 px-4">
          Payment method
        </h1>

        <v-card>
          <v-card-text>
            <payment-method-details
              :payment-details="paymentDetails"
              :loading="loadingRemove"
              @payment-method:remove="onPaymentMethodRemove"
            />
          </v-card-text>
        </v-card>
      </div>

      <div
        v-else
        key="payment-create"
      >
        <h1 class="display-1 mb-3 px-4">
          Add payment method
        </h1>

        <v-card>
          <v-card-text>
            <payment-method-add
              :loading="loadingCreate"
              @payment-method:create="onPaymentMethodCreate"
            />
          </v-card-text>
        </v-card>
      </div>
    </v-fade-transition>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentMethodDetails from '~/components/sections/payment/PaymentMethodDetails'
import PaymentMethodAdd from '~/components/sections/payment/PaymentMethodAdd'

export default {
  name: 'ViewPayment',

  components: {
    PaymentMethodAdd,
    PaymentMethodDetails
  },

  data () {
    return {
      isFetching: true,
      loadingRemove: false,
      loadingCreate: false,

      paymentDetails: {}
    }
  },

  computed: {
    hasPaymentMethod () {
      return !!this.paymentDetails?.card_token
    }
  },

  mounted () {
    this.fetchPaymentDetails()
  },

  methods: {
    ...mapActions({
      paymentDetailsLoad: 'payment/paymentDetailsLoad',
      paymentDetailsCreate: 'payment/paymentDetailsCreate',
      paymentDetailsRemove: 'payment/paymentDetailsRemove',
      notificationShow: 'notifications/show'
    }),

    async fetchPaymentDetails () {
      this.isFetching = true

      try {
        this.paymentDetails = await this.paymentDetailsLoad()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to fetch payment details'
        })
      } finally {
        this.isFetching = false
      }
    },

    async onPaymentMethodRemove () {
      this.loadingRemove = true

      try {
        await this.paymentDetailsRemove({
          last4: this.paymentDetails.last4
        })

        this.paymentDetails = {}

        this.notificationShow({
          type: 'success',
          message: 'Payment method has been removed!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to remove payment method'
        })

        throw err
      } finally {
        this.loadingRemove = false
      }
    },

    async onPaymentMethodCreate (paymentDetails) {
      this.loadingCreate = true

      try {
        await this.paymentDetailsCreate(paymentDetails)

        this.notificationShow({
          type: 'success',
          message: 'Payment method has been saved!'
        })

        this.fetchPaymentDetails()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to save payment method'
        })

        throw err
      } finally {
        this.loadingCreate = false
      }
    }
  },

  head () {
    return {
      title: this.$routes.payment.title
    }
  }
}
</script>
