<template>
  <v-row>
    <a-column
      cols="12"
      md="6"
      lg="4"
    >
      <v-card>
        <v-card-text>
          <div class="mb-6">
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
            <v-icon>
              mdi-delete
            </v-icon>
            Remove the card
          </v-btn>
        </v-card-text>
      </v-card>
    </a-column>

    <a-column
      cols="12"
      md="6"
      lg="4"
    >
      <v-card height="100%">
        <v-card-text
          style="height: 100%;"
        >
          <div
            v-if="subscriptionFormatted.price"
            class="d-flex flex-column justify-space-between"
          >
            <div
              class="d-flex flex-column justify-center align-center flex-grow-1"
            >
              <div class="text-h5">
                Subscription
              </div>

              <div class="text-h5">
                {{ subscriptionFormatted.price }}
              </div>
            </div>

            <v-btn
              :loading="loading.subscription"
              small
              width="210px"
              @click="onSubscriptionCancel"
            >
              <v-icon>
                mdi-delete
              </v-icon>
              Cancel subscription
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </a-column>

    <a-column
      cols="12"
      lg="8"
      class="mt-5"
    >
      <v-card>
        <v-card-text>
          <v-btn
            :loading="loading.payment || loading.subscription"
            block
            @click="onRemove"
          >
            <v-icon>
              mdi-delete
            </v-icon>
            Remove all
          </v-btn>
        </v-card-text>
      </v-card>
    </a-column>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters({
      plans: 'payment/plans'
    }),

    cardDetailsFormatted () {
      const details = this.paymentDetails || {}

      return [
        {
          label: 'Card number',
          value: `**${details.last4}`
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
        price: plan?.priceLabel
      }
    }
  },

  methods: {
    onRemovePaymentMethod () {
      this.$emit('remove:payment-method')
    },

    onSubscriptionCancel () {
      this.$emit('remove:subscription')
    },

    onRemove () {
      this.onRemovePaymentMethod()
    }
  }
}
</script>
