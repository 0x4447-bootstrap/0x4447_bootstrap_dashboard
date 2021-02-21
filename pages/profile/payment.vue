<template>
  <v-layout column>
    <v-fade-transition
      mode="out-in"
    >
      <progress-content
        v-if="isFetching"
        key="payment-fetching"
      />

      <div
        v-else-if="hasPaymentMethod"
        key="payment-details"
      >
        <page-title
          title="Payment method"
          anchor="payment-method"
        />

        <payment-method-details
          :payment-details="paymentDetails"
          :loading="loadingRemove"
          @remove:payment-method="onPaymentMethodRemove"
          @remove:subscription="onPaymentMethodRemove"
        />
      </div>

      <div
        v-else
        key="payment-create"
      >
        <page-title
          title="Subscription"
          anchor="add-payment-method"
        />

        <payment-method-add
          :loading="loadingCreate"
          @payment-method:create="onPaymentMethodCreate"
        />
      </div>
    </v-fade-transition>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentMethodDetails from '~/components/sections/payment/PaymentMethodDetails'
import PaymentMethodAdd from '~/components/sections/payment/PaymentMethodAdd'
import ProgressContent from '~/components/general/ProgressContent'

export default {
  name: 'ViewPayment',

  components: {
    PaymentMethodAdd,
    PaymentMethodDetails,
    ProgressContent
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

  beforeMount () {
    this.fetchPaymentDetails()
  },

  methods: {
    ...mapActions({
      fetchCountriesList: 'app/fetchCountriesList',
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
        try {
          await this.fetchCountriesList()
        } catch (err) {
          // Fail silently
        }

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
          message: 'Payment method has been created!'
        })

        this.fetchPaymentDetails()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to create a payment method'
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
