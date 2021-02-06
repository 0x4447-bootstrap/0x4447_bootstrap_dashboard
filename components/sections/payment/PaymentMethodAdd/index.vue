<template>
  <v-row>
    <a-column
      cols="12"
      md="4"
      class="mb-5 mb-md-0"
    >
      <v-card height="100%">
        <v-card-text class="plans__list">
          <button
            v-ripple
            :class="classPlanButton(plans[0])"
            class="plan-button__container elevation-3"
            @click="onPlanSelect(plans[0])"
          >
            <div class="plan-button__name mb-5">
              Monthly subscription
            </div>

            <div class="plan-button__price">
              $1/month
            </div>
          </button>

          <button
            v-ripple
            :class="classPlanButton(plans[1])"
            class="plan-button__container elevation-3"
            @click="onPlanSelect(plans[1])"
          >
            <div class="plan-button__name mb-5">
              Yearly subscription
            </div>

            <div class="plan-button__price">
              $10/month
            </div>
          </button>
        </v-card-text>
      </v-card>
    </a-column>

    <a-column
      cols="12"
      md="8"
    >
      <v-row class="flex-column flex-nowrap">
        <v-col
          cols="12"
          md="6"
          xl="3"
        >
          <v-card>
            <v-card-text>
              <div>
                <div
                  id="cardForm"
                  class="mb-5"
                  style="max-width: 380px"
                />

                <p
                  class="mb-0"
                >
                  This input field is provided by © Stripe. We won't be able to see your details, we get back a
                  token
                  representing your card, and not the card details that you type here.
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
          xl="3"
        >
          <v-card>
            <v-card-text>
              <form
                class="plans__form"
                @submit.prevent="onSave"
              >
                <div class="mb-5">
                  <a-validation
                    v-slot="{ hasError, errorMessage }"
                    :error="$v.paymentDetails.firstName"
                  >
                    <v-text-field
                      v-model="paymentDetails.firstName"
                      :error="hasError"
                      :error-messages="errorMessage"
                      label="First name"
                    />
                  </a-validation>

                  <a-validation
                    v-slot="{ hasError, errorMessage }"
                    :error="$v.paymentDetails.lastName"
                  >
                    <v-text-field
                      v-model="paymentDetails.lastName"
                      :error="hasError"
                      :error-messages="errorMessage"
                      label="Last name"
                    />
                  </a-validation>

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
                  color="primary"
                  type="submit"
                >
                  Save
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
import { mapGetters } from 'vuex'
import { loadStripe } from '@stripe/stripe-js'
import { required } from 'vuelidate/lib/validators'

const initialForm = {
  firstName: '',
  lastName: '',
  country: '',
  postalCode: ''
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

      paymentDetails: {
        ...initialForm
      },

      planSelected: null
    }
  },

  computed: {
    ...mapGetters({
      countries: 'app/countries',
      ipInfo: 'app/ipInfo',
      isProfileEmpty: 'user/isProfileEmpty',
      profile: 'user/profile'
    }),

    plans () {
      const config = this.$config

      return [
        config.STRIPE_PRICE_ID_MONTH,
        config.STRIPE_PRICE_ID_YEAR
      ]
    }
  },

  mounted () {
    this.preFillUserInfo()
    this.initStripe()
  },

  methods: {
    async initStripe () {
      this.stripeClient = await loadStripe(this.$config.STRIPE_PUBLIC_KEY)

      const isDarkTheme = this.$vuetify.theme.dark

      this.stripeCardField = this.stripeClient.elements().create('card', {
        style: {
          base: {
            color: isDarkTheme ? '#fff' : '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        },
        value: {
          postalCode: this.paymentDetails.postalCode
        }
      })

      const cardSelector = '#cardForm'
      if (!document.querySelector(cardSelector)) {
        return
      }

      this.stripeCardField.mount(cardSelector)
    },

    preFillUserInfo () {
      const ipInfo = this.ipInfo

      const {
        zip,
        country
      } = ipInfo

      if (zip && zip.length === 5) {
        this.paymentDetails.postalCode = zip
      }

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

      // eslint-disable-next-line no-unreachable
      const { token } = await this.stripeClient.createToken(this.stripeCardField)

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
        plan: this.planSelected,
        postalCode: card.address_zip,
        brand: card.brand,
        cardId: card.id,
        cardToken: token.id,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year
      })
    }
  },

  validations () {
    return {
      paymentDetails: {
        firstName: {
          required
        },
        lastName: {
          required
        },
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
    display: flex;
    flex-flow: column;
  }

  &__form {
    width: 50%;
  }

  @media (max-width: 1024px) {
    &__form {
      width: 100%;
    }
  }
}

.plan-button {
  &__container {
    flex: 1;
    outline: none;
    border-radius: 5px;
    border: 2px solid transparent;
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
