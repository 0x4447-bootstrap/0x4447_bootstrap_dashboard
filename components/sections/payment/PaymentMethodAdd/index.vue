<template>
  <v-row>
    <v-col
      cols="12"
      class="py-0"
    >
      <form
        @submit.prevent="onSave"
      >
        <v-row class="fill-height flex-column flex-nowrap">
          <v-col
            cols="12"
            md="6"
          >
            <div>
              <div
                id="cardForm"
                class="mb-5"
                style="max-width: 380px"
              />

              <p
                class="subtitle-2 mb-0"
              >
                This input field is provided by © Stripe. We won't be able to see your details, we get back a token representing your card, and not the card details that you type here.
              </p>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="6"
            lg="4"
            class="py-0"
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
                :error="$v.paymentDetails.streetAddress"
              >
                <v-text-field
                  v-model="paymentDetails.streetAddress"
                  :error="hasError"
                  :error-messages="errorMessage"
                  label="Street address"
                />
              </a-validation>

              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.paymentDetails.city"
              >
                <v-text-field
                  v-model="paymentDetails.city"
                  :error="hasError"
                  :error-messages="errorMessage"
                  label="City"
                />
              </a-validation>

              <v-text-field
                v-model="paymentDetails.state"
                label="State"
              />

              <v-text-field
                v-model="paymentDetails.postalCode"
                label="Postal Code"
              />

              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.paymentDetails.country"
              >
                <v-text-field
                  v-model="paymentDetails.country"
                  :error="hasError"
                  :error-messages="errorMessage"
                  label="Country"
                />
              </a-validation>
            </div>

            <v-btn
              :loading="loading"
              color="primary"
              type="submit"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-col>
  </v-row>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'
import { required } from 'vuelidate/lib/validators'

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
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    }
  },

  mounted () {
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
        }
      })

      const cardSelector = '#cardForm'
      if (!document.querySelector(cardSelector)) {
        return
      }

      this.stripeCardField.mount(cardSelector)
    },

    async onSave () {
      if (this.$v.paymentDetails.$invalid) {
        return this.$v.paymentDetails.$touch()
      }

      const { token } = await this.stripeClient.createToken(this.stripeCardField)

      if (!token) {
        return
      }

      const { card } = token

      this.$emit('payment-method:create', {
        ...this.paymentDetails,
        postalCode: this.paymentDetails.postalCode || card.address_zip,
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
        streetAddress: {
          required
        },
        city: {
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
