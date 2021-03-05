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
        v-else-if="hadSubscription"
        key="subscription-details"
      >
        <page-title
          title="Subscription"
          anchor="subscription"
        />

        <payment-method-details
          :payment-details="paymentDetails"
          :subscription-details="subscriptionDetails"
          :loading.sync="loading"
          @payment-method:create="onPaymentMethodCreate"
          @payment-method:remove="onPaymentMethodRemove"
          @subscription:cancel="onSubscriptionCancel"
          @subscription:change="onSubscriptionChange"
        />
      </div>

      <div
        v-else
        key="subscription-create"
      >
        <page-title
          title="Subscription"
          anchor="subscription"
        />

        <payment-method-add
          :loading.sync="loadingCreate"
          @subscription:create="onSubscriptionCreate"
        />
      </div>
    </v-fade-transition>

    <modal-subscription-change
      :is-open.sync="isModalSubscriptionChangeOpen"
      :plan="subscriptionPlanChange"
      @subscription:updated="onSubscriptionUpdated"
    />
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentMethodDetails from '~/components/sections/payment/PaymentMethodDetails'
import PaymentMethodAdd from '~/components/sections/payment/PaymentMethodAdd'
import ProgressContent from '~/components/general/ProgressContent'
import ModalSubscriptionChange from '~/components/modals/ModalSubscriptionChange'

export default {
  name: 'ViewPayment',

  components: {
    PaymentMethodAdd,
    PaymentMethodDetails,
    ProgressContent,
    ModalSubscriptionChange
  },

  data () {
    return {
      isFetching: true,
      loading: {
        payment: false,
        subscription: false
      },
      loadingCreate: false,

      paymentDetails: {},
      subscriptionDetails: {},

      isModalSubscriptionChangeOpen: false,
      subscriptionPlanChange: {}
    }
  },

  computed: {
    hadSubscription () {
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
      subscriptionPriceUpdate: 'payment/subscriptionPriceUpdate',
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
      this.loading.payment = true

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
        this.loading.payment = false
      }
    },

    onSubscriptionUpdated (priceId) {
      this.subscriptionDetails = {
        ...this.subscriptionDetails,
        price_id: priceId
      }
    },

    async onSubscriptionCancel () {
      this.loading.subscription = true

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
        this.loading.subscription = false
      }
    },

    async onSubscriptionCreate (paymentDetails) {
      this.loadingCreate = true

      try {
        await Promise.all([
          this.paymentDetailsCreate(paymentDetails),
          this.subscriptionPriceUpdate({
            priceId: paymentDetails.priceId
          })
        ])

        this.notificationShow({
          type: 'success',
          message: 'Subscription has been created!'
        })

        this.fetchPaymentDetails()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to create subscription'
        })

        throw err
      } finally {
        this.loadingCreate = false
      }
    },

    async onPaymentMethodCreate (paymentDetails) {
      this.loading.payment = true

      try {
        await this.paymentDetailsCreate(paymentDetails)

        this.paymentDetails = await this.paymentDetailsLoad()

        this.notificationShow({
          type: 'success',
          message: 'Payment method has been created!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to create a payment method'
        })

        throw err
      } finally {
        this.loading.payment = false
      }
    },

    onSubscriptionChange (plan) {
      this.subscriptionPlanChange = plan

      this.isModalSubscriptionChangeOpen = true
    }
  },

  head () {
    return {
      title: this.$routes.payment.title
    }
  }
}
</script>
