<template>
  <v-row>
    <a-column
      cols="12"
      md="6"
      class="mb-5 mb-md-0"
    >
      <v-card style="height: 100%;">
        <v-card-text
          class="d-flex flex-column justify-space-between align-start"
          style="height: 100%;"
        >
          <div
            v-if="hasPaymentMethod"
            key="payment-method"
            style="width: 100%;"
          >
            <div
              class="mb-6"
              style="width: 100%;"
            >
              <v-simple-table
                dense
              >
                <template #default>
                  <tbody>
                    <tr
                      v-for="(field, index) in cardDetailsFormatted"
                      :key="index"
                    >
                      <td>{{ field.label }}</td>
                      <td>{{ field.value }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>

            <v-btn
              :loading="loading.payment"
              small
              @click="onRemovePaymentMethod"
            >
              <v-icon class="mr-1">
                mdi-delete
              </v-icon>
              Remove the card
            </v-btn>
          </div>

          <div
            v-else
            key="payment-method-setup"
          >
            <h4 class="text-h6 mb-5">
              Add payment method
            </h4>

            <div
              id="cardForm"
              style="max-width: 380px"
              class="mb-5"
            />

            <p
              class="mb-5"
              style="font-size: 12px;"
            >
              This input field is provided by © Stripe. We won't be able to see your details, we get back a
              token representing your card, and not the card details that you type here.
            </p>

            <v-btn
              :loading="loading.payment"
              @click="onPaymentMethodCreate"
            >
              Save
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </a-column>

    <a-column
      cols="12"
      md="6"
      lg="6"
    >
      <v-card height="100%">
        <v-card-text
          style="height: 100%;"
        >
          <div
            v-if="subscriptionFormatted.price"
            class="d-flex flex-column justify-space-between"
            style="height: 100%;"
          >
            <div
              class="mb-5 mb-md-0 d-flex flex-column justify-center align-center flex-grow-1"
            >
              <div class="text-h5">
                {{ subscriptionFormatted.label }}
              </div>

              <div class="text-h5">
                {{ subscriptionFormatted.price }}
              </div>
            </div>

            <div class="payment-method-details__actions">
              <v-menu
                rounded="lg"
                offset-y
              >
                <template #activator="{ attrs, on }">
                  <v-btn
                    class="mr-5"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="mr-1">
                      mdi-calendar-edit
                    </v-icon>
                    Change pricing
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-for="plan in availablePlans"
                    :key="plan.id"
                    link
                    @click="onPlanChange(plan)"
                  >
                    <v-list-item-title v-text="plan.label" />
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-btn
                :loading="loading.subscription"
                width="210px"
                small
                @click="onSubscriptionCancel"
              >
                <v-icon class="mr-1">
                  mdi-delete
                </v-icon>
                Cancel subscription
              </v-btn>
            </div>
          </div>

          <div
            v-else
          >
            <div
              class="plans__list mb-5"
            >
              <button
                v-for="plan in plans"
                :key="plan.id"
                v-ripple
                :class="classPlanButton(plan.id)"
                class="plan-button__container elevation-3"
                @click="onPlanSelect(plan)"
              >
                <div class="plan-button__name mb-5">
                  {{ plan.label }}
                </div>

                <div class="plan-button__price">
                  {{ plan.priceLabel }}
                </div>
              </button>
            </div>

            <v-btn
              :loading="loading.subscription"
              @click="onPlanChange(planSelected)"
            >
              Subscribe
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </a-column>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { initStripeCardWidget } from '@/components/sections/payment/subscription-helpers'

export default {
  name: 'PaymentMethodDetails',

  props: {
    paymentDetails: {
      type: Object,
      default: () => ({})
    },

    subscriptionDetails: {
      type: Object,
      default: () => ({})
    },

    loading: {
      type: Object,
      default: () => ({
        payment: false,
        subscription: false
      })
    }
  },

  data () {
    return {
      planSelected: {},

      stripeClient: null,
      stripeCardField: null
    }
  },

  computed: {
    ...mapGetters({
      plans: 'payment/plans'
    }),

    hasPaymentMethod () {
      return !!this.paymentDetails?.card_token
    },

    cardDetailsFormatted () {
      const details = this.paymentDetails || {}

      return [
        {
          label: 'Last 4',
          value: details.last4
        },
        {
          label: 'Expiration date',
          value: `${details.exp_month}/${details.exp_year}`
        },
        {
          label: 'Brand',
          value: details.brand
        }
      ]
    },

    subscriptionFormatted () {
      const details = this.subscriptionDetails || {}
      const plan = this.plans.find(plan => plan.id === details.price_id)

      return {
        price: plan?.priceLabel,
        label: plan?.label
      }
    },

    availablePlans () {
      return this.plans.filter(plan => plan.id !== this.subscriptionDetails.price_id)
    }
  },

  watch: {
    hasPaymentMethod: {
      immediate: true,
      handler (nextValue) {
        if (!nextValue) {
          this.initStripe()
        } else if (this.stripeCardField) {
          this.stripeCardField?.destroy()
        }
      }
    }
  },

  beforeMount () {
    this.planSelected = this.plans[0]
  },

  methods: {
    classPlanButton (planId) {
      return [
        { 'plan-button--active': this.planSelected?.id === planId }
      ]
    },

    async initStripe () {
      const {
        stripeClient,
        stripeCardField
      } = await initStripeCardWidget({
        stripePublicKey: this.$config.STRIPE_PUBLIC_KEY,
        isDarkTheme: this.$vuetify.theme.dark,
        postalCode: this.paymentDetails.postalCode
      })

      this.stripeClient = stripeClient
      this.stripeCardField = stripeCardField

      const cardSelector = '#cardForm'
      if (!document.querySelector(cardSelector)) {
        return
      }

      this.stripeCardField.mount(cardSelector)
    },

    async onPaymentMethodCreate () {
      let token = ''
      try {
        this.$emit('update:loading', {
          payment: true,
          subscription: this.loading.subscription
        })

        // eslint-disable-next-line no-unreachable
        const { token: cardToken } = await this.stripeClient.createToken(this.stripeCardField)

        token = cardToken
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Stripe error', err)
        this.$emit('update:loading', {
          payment: false,
          subscription: this.loading.subscription
        })
      }

      if (!token) {
        return
      }

      const { card } = token

      if (this.$nuxt.context.isDev) {
        // eslint-disable-next-line no-console
        console.warn('Stripe card details', card)
      }

      this.$emit('payment-method:create', {
        ...this.paymentDetails,
        plan: this.subscriptionDetails.price_id,
        postalCode: card.address_zip,
        brand: card.brand,
        cardId: card.id,
        cardToken: token.id,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year
      })
    },

    onPlanSelect (plan) {
      this.planSelected = plan
    },

    onRemovePaymentMethod () {
      this.$emit('payment-method:remove')
    },

    onSubscriptionCancel () {
      this.$emit('subscription:cancel')
    },

    onPlanChange (plan) {
      this.$emit('subscription:change', plan)
    }
  }
}
</script>

<style lang="scss">
.payment-method-details {
  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.plans {
  &__list {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 12px;
  }
}

.plan-button {
  &__container {
    flex-grow: 1;
    outline: none;
    border-radius: 5px;
    border: 2px solid transparent;
    padding: 24px 0;
  }

  &--active {
    border-color: #2196F3;
  }

  @media (max-width: 768px) {
    &__container {
      padding: 30px;
    }
  }
}
</style>
