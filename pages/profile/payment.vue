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
          :subscription-details="subscriptionDetails"
          :loading="loadingRemove"
          @remove:payment-method="onPaymentMethodRemove"
          @remove:subscription="onSubscriptionCancel"
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
      loadingRemove: {
        payment: false,
        subscription: false
      },
      loadingCreate: false,

      paymentDetails: {},
      subscriptionDetails: {}
    }
  },

  computed: {
    hasPaymentMethod () {
      return !!this.paymentDetails?.card_token || this.subscriptionDetails?.price_id
    }
  },

  beforeMount () {
    this.fetchPaymentDetails()
  },

  methods: {
    ...mapActions({
      fetchCountriesList: 'app/fetchCountriesList',
      paymentDetailsLoad: 'payment/paymentDetailsLoad',
      subscriptionDetailsLoad: 'payment/subscriptionDetailsLoad',
      paymentDetailsCreate: 'payment/paymentDetailsCreate',
      paymentDetailsRemove: 'payment/paymentDetailsRemove',
      subscriptionCancel: 'payment/subscriptionCancel',
      notificationShow: 'notifications/show'
    }),

    async fetchPaymentDetails () {
      this.isFetching = true

      try {
        const [paymentDetails, subscriptionDetails] = await Promise.all([
          this.paymentDetailsLoad(),
          this.subscriptionDetailsLoad()
        ])
        this.paymentDetails = paymentDetails
        this.subscriptionDetails = subscriptionDetails
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
      this.loadingRemove.payment = true

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
        this.loadingRemove.payment = false
      }
    },

    async onSubscriptionCancel () {
      this.loadingRemove.subscription = true

      try {
        await this.subscriptionCancel()

        this.subscriptionDetails = {}

        this.notificationShow({
          type: 'success',
          message: 'Payment method has been removed!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to cancel subscription'
        })

        throw err
      } finally {
        this.loadingRemove.subscription = false
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
