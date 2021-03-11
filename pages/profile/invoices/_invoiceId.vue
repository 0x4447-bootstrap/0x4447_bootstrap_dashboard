<template>
  <v-layout column>
    <page-title
      :title="`Invoice #${invoiceId}`"
      :anchor="`invoice-${invoiceId}`"
    />

    <v-row>
      <a-column
        cols="12"
        sm="12"
        md="6"
        lg="auto"
        class="mb-5 mb-md-0"
      >
        <v-card width="100%">
          <v-card-text>
            <v-simple-table>
              <template #default>
                <tbody>
                  <tr
                    v-for="field in invoiceFormatted"
                    :key="field.label"
                  >
                    <template
                      v-if="field.label === 'Status'"
                    >
                      <td>{{ field.label }}</td>
                      <td>
                        <v-chip
                          v-if="field.value"
                          color="success"
                          small
                        >
                          Paid
                        </v-chip>
                        <v-chip
                          v-else
                          color="error"
                          small
                        >
                          Not paid
                        </v-chip>
                      </td>
                    </template>

                    <template
                      v-else-if="field.copy"
                    >
                      <td>
                        {{ field.label }}
                      </td>

                      <td>
                        {{ field.value }}

                        <v-btn
                          icon
                          ml="4"
                          small
                          @click.stop="onCopy(field.value, field.label)"
                        >
                          <v-icon small>
                            mdi-content-copy
                          </v-icon>
                        </v-btn>
                      </td>
                    </template>

                    <template
                      v-else
                    >
                      <td>{{ field.label }}</td>
                      <td>{{ field.value }}</td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <v-btn
              v-if="invoice.paid"
              :href="invoice.invoice_pdf"
              :loading="isLoading"
              class="mt-5"
              color="info"
              @click="onDownload"
            >
              Download
            </v-btn>
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

export default {
  name: 'ViewInvoicesInvoiceId',

  middleware ({
    params,
    redirect
  }) {
    if (!params.invoiceId) {
      redirect(302, '/profile/invoices')
    }
  },

  async asyncData ({
    params,
    store
  }) {
    const invoice = await store.dispatch('invoices/invoiceLoad', {
      invoiceId: params.invoiceId
    })

    return {
      invoiceId: params.invoiceId,
      invoice
    }
  },

  data () {
    return {
      isLoading: false,

      invoiceId: '',
      invoice: {}
    }
  },

  computed: {
    invoiceFormatted () {
      const invoice = this.invoice

      return [
        {
          label: 'Invoice ID',
          value: invoice.stripe_invoice_id || 'N/A',
          copy: !!invoice.stripe_invoice_id
        },
        {
          label: 'Charge ID',
          value: invoice.charge_id || 'N/A',
          copy: !!invoice.charge_id
        },
        {
          label: 'Created',
          value: invoice.created ? format(parseISO(invoice.created), 'MM/dd/yyyy, hh:mm:ss a') : 'N/A'
        },
        ...(!invoice.paid ? [] : [
          {
            label: 'Amount',
            value: invoice.amount_paid ? `${invoice.amount_paid / 100} ${invoice.currency}` : 0
          }
        ]),
        {
          label: 'Status',
          value: invoice.paid
        },
        ...(!invoice.next_payment_attempt ? [] : [
          {
            label: 'Next Payment Attempt',
            value: invoice.next_payment_attempt
              ? format(parseISO(invoice.next_payment_attempt), 'MM/dd/yyyy, hh:mm:ss a')
              : ''
          }
        ])
      ]
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    onCopy (text, field) {
      this.$copyToClipboard(text)

      this.notificationShow({
        type: 'success',
        message: `${field ? `${field} copied` : 'Copied'} to clipboard!`
      })
    },

    onDownload () {
      this.isLoading = true

      setTimeout(() => {
        this.isLoading = false
      }, 5000)
    }
  }
}
</script>
