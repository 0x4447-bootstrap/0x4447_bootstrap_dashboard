<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
      lg="4"
      class="py-0"
    >
      <div class="mb-6">
        <v-simple-table
          dense
        >
          <template #default>
            <tbody>
              <tr
                v-for="(field, index) in paymentDetailsFormatted"
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
        :loading="loading"
        color="error"
        small
        @click="onRemove"
      >
        <v-icon>
          mdi-delete
        </v-icon>
        Remove payment method
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PaymentMethodDetails',

  props: {
    paymentDetails: {
      type: Object,
      default: () => ({})
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    paymentDetailsFormatted () {
      const details = this.paymentDetails || {}
      const { address } = details || {}

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
        },
        {
          label: 'First Name',
          value: details.first_name || '-'
        },
        {
          label: 'Last Name',
          value: details.last_name || '-'
        },
        {
          label: 'Street Address',
          value: address.street_address || '-'
        },
        {
          label: 'City',
          value: address.city || '-'
        },
        {
          label: 'State',
          value: address.state || '-'
        },
        {
          label: 'Postal Code',
          value: address.postal_code || '-'
        },
        {
          label: 'Country',
          value: address.country || '-'
        }
      ]
    }
  },

  methods: {
    onRemove () {
      this.$emit('payment-method:remove')
    }
  }
}
</script>
