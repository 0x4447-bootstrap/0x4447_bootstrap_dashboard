<template>
  <v-row>
    <a-column
      cols="12"
      md="6"
      class="mb-5 mb-md-0 d-flex flex-column"
    >
      <v-card class="mb-5 flex-grow-1">
        <v-card-text class="plans__list">
          <button
            v-for="plan in plans"
            :key="plan.id"
            v-ripple
            :class="classPlanButton(plan.id)"
            class="plan-button__container elevation-3"
            @click="onPlanSelect(plan.id)"
          >
            <div class="plan-button__price mb-5">
              {{ plan.priceLabel }}
            </div>

            <div class="plan-button__name">
              {{ plan.label }}
            </div>
          </button>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <div class="plans__coupon">
            <v-text-field
              v-model="coupon"
              :hint="couponApplied ? 'Coupon applied' : ''"
              :persistent-hint="couponApplied"
              label="Coupon"
              class="plans__coupon__field"
              dense
            />

            <v-btn
              v-if="!couponApplied"
              :disabled="!coupon"
              :loading="loadingCoupon"
              class="plans__coupon__apply"
              small
              @click="onCouponApply"
            >
              Check
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </a-column>

    <a-column
      cols="12"
      md="6"
    >
      <v-row class="flex-column flex-nowrap">
        <v-col
          cols="12"
        >
          <v-card>
            <v-card-text>
              <div>
                Total: <strong>{{ total }}</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
        >
          <v-card>
            <v-card-text>
              <div
                id="cardForm"
                style="max-width: 380px"
                class="mb-5"
              />

              <p
                class="mb-0"
                style="font-size: 12px;"
              >
                This input field is provided by © Stripe. We won't be able to see your details, we get back a
                token representing your card, and not the card details that you type here.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
        >
          <v-card>
            <v-card-text>
              <form
                class="plans__form"
                @submit.prevent="onSave"
              >
                <div class="flex-grow-1">
                  <a-validation
                    v-slot="{ hasError, errorMessage }"
                    :error="$v.paymentDetails.country"
                  >
                    <v-autocomplete
                      v-model="paymentDetails.country"
                      :items="countries"
                      :error="hasError"
                      :error-messages="errorMessage"
                      label="Country"
                      item-text="name"
                      item-value="name"
                    />
                  </a-validation>
                </div>

                <v-btn
                  :disabled="!planSelected"
                  :loading="loading"
                  class="ml-5"
                  color="primary"
                  type="submit"
                >
                  Subscribe
                </v-btn>
              </form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </a-column>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { initStripeCardWidget } from '../subscription-helpers'

const initialForm = {
  country: ''
}

export default {
  name: 'PaymentMethodAdd',

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      stripeClient: null,
      stripeCardField: null,

      loadingCoupon: false,

      coupon: '',
      couponApplied: false,
      couponDiscount: 0,
      paymentDetails: {
        ...initialForm
      },

      planSelected: this.$config.STRIPE_PRICE_ID_YEAR
    }
  },

  computed: {
    ...mapGetters({
      countries: 'app/countries',
      countryByTimezone: 'app/countryByTimezone',
      isProfileEmpty: 'user/isProfileEmpty',
      profile: 'user/profile',
      plans: 'payment/plans'
    }),

    total () {
      const selectedPlan = this.plans.find(plan => plan.id === this.planSelected)

      if (!selectedPlan) {
        return '$0'
      }

      const price = selectedPlan.price

      const isMonth = selectedPlan.unit === 'month'
      const unitCount = isMonth ? 12 : 1
      const couponDiscount = this.couponDiscount || 0

      const unitPrice = price * unitCount
      const discountAmount = unitPrice * couponDiscount / 100

      switch (true) {
        // monthly with coupon
        case isMonth:
          return `($${price} * ${unitCount}) - ${couponDiscount}% = $${unitPrice - discountAmount}`
        // yearly with coupon
        case !isMonth:
          return `$${unitPrice} - ${couponDiscount}% = $${unitPrice - discountAmount}`
        default:
          return `${price}$`
      }
    }
  },

  watch: {
    coupon (nextValue, prevValue) {
      if (nextValue !== prevValue) {
        this.couponApplied = false
      }
    }
  },

  mounted () {
    this.preFillUserInfo()
    this.initStripe()
  },

  methods: {
    ...mapActions({
      couponCheck: 'payment/couponCheck',
      notificationShow: 'notifications/show'
    }),

    async initStripe () {
      const { stripeClient, stripeCardField } = await initStripeCardWidget({
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

    preFillUserInfo () {
      const country = this.countryByTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

      if (country) {
        this.paymentDetails.country = country
      }
    },

    classPlanButton (planId) {
      return [
        { 'plan-button--active': this.planSelected === planId }
      ]
    },

    onPlanSelect (planId) {
      this.planSelected = planId
    },

    async onSave () {
      if (this.$v.paymentDetails.$invalid) {
        return this.$v.paymentDetails.$touch()
      }

      let token = ''
      this.$emit('update:loading', true)

      try {
        // eslint-disable-next-line no-unreachable
        const { token: cardToken } = await this.stripeClient.createToken(this.stripeCardField)

        token = cardToken
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Stripe error', err)
      } finally {
        this.$emit('update:loading', false)
      }

      if (!token) {
        return
      }

      const { card } = token

      if (this.$nuxt.context.isDev) {
        // eslint-disable-next-line no-console
        console.warn('Stripe card details', card)
      }

      this.$emit('subscription:create', {
        ...this.paymentDetails,
        ...(this.coupon && {
          coupon: this.coupon
        }),
        priceId: this.planSelected,
        postalCode: card.address_zip,
        brand: card.brand,
        cardId: card.id,
        cardToken: token.id,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year
      })
    },

    async onCouponApply () {
      this.loadingCoupon = true

      try {
        const { valid } = await this.couponCheck({
          coupon: this.coupon
        })

        if (!valid) {
          return this.notificationShow({
            type: 'error',
            message: 'Coupon is not valid'
          })
        }

        this.couponApplied = true
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return this.notificationShow({
          type: 'error',
          message: 'Coupon is not valid'
        })
      } finally {
        this.loadingCoupon = false
      }
    }
  },

  validations () {
    return {
      paymentDetails: {
        country: {
          required
        }
      }
    }
  }
}
</script>

<style lang="scss">
.plans {
  &__list {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 12px;
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__coupon {
    grid-column: span 2;
    display: flex;
    align-items: center;
  }

  &__coupon__apply {
    margin-left: 12px;
  }

  @media (max-width: 480px) {
    &__list {
      height: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-row-gap: 12px;
    }
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

  &__price {
    font-size: 24px;
  }

  &--active {
    border-color: #2196F3;
  }

  @media (max-width: 768px) {
    &__container {
      padding: 30px;
    }

    &__price {
      font-size: 20px;
    }
  }
}
</style>
