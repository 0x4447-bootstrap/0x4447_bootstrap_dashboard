<template>
  <v-layout column>
    <title-anchored
      anchor="invoices"
    >
      <h1 class="display-1 mb-3 px-4">
        Invoices
      </h1>
    </title-anchored>

    <v-card>
      <v-card-text>
        <v-row>
          <a-column
            cols="12"
          >
            <v-data-table
              :page.sync="page"
              v-bind="bindingsTable"
              class="elevation-1"
              @update:page="onPageChange"
              @click:row="onOpenInvoice"
            >
              <template
                #item.paid="{ item }"
              >
                <v-chip
                  v-if="item.paid"
                  color="success"
                >
                  Paid
                </v-chip>
                <v-chip
                  v-else
                  color="error"
                >
                  Not paid
                </v-chip>
              </template>

              <template
                #item.invoiceId="{ item } "
              >
                {{ item.invoiceIdFormatted }}

                <v-btn
                  icon
                  ml="4"
                  small
                  @click="onCopy(item.invoiceIdFormatted, 'Invoice ID')"
                >
                  <v-icon small>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>

              <template
                #item.chargeId="{ item } "
              >
                {{ item.chargeId }}

                <v-btn
                  icon
                  ml="4"
                  small
                  @click="onCopy(item.chargeId, 'Charge ID')"
                >
                  <v-icon small>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>

              <template
                #footer.page-text
              >
                {{ getPageText }}
              </template>
            </v-data-table>
          </a-column>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { orderBy } from 'lodash'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewPaymentIndex',

  components: {
    TitleAnchored
  },

  data () {
    return {
      page: 1,
      total: 0,

      loadingList: true,
      headers: [
        {
          text: 'Created',
          value: 'created',
          sortable: true
        },
        {
          text: 'Amount',
          value: 'amount',
          sortable: false
        },
        {
          text: 'Paid',
          value: 'paid',
          sortable: false
        },
        {
          text: 'Invoice ID',
          value: 'invoiceId',
          sortable: false
        },
        {
          text: 'Charge Id',
          value: 'chargeId',
          sortable: false
        },
        {
          text: 'Next Payment Attempt',
          value: 'nextPaymentAttempt',
          sortable: false
        }
      ],
      invoices: []
    }
  },

  computed: {
    invoicesFormatted () {
      return orderBy(this.invoices, ['created'], 'desc').map(invoice => ({
        created: invoice.created ? format(parseISO(invoice.created), 'MM/dd/yyyy, hh:mm:ss a') : 'N/A',
        amount: invoice.amount_paid ? `${invoice.amount_paid / 100} ${invoice.currency}` : 0,
        paid: invoice.paid,
        invoiceId: invoice.stripe_invoice_id,
        invoiceIdFormatted: invoice.stripe_invoice_id?.substring(3) || 'N/A',
        chargeId: invoice.charge_id?.substring(3) || 'N/A',
        nextPaymentAttempt: invoice.next_payment_attempt
          ? format(parseISO(invoice.next_payment_attempt), 'MM/dd/yyyy, hh:mm:ss a')
          : ''
      }))
    },

    bindingsTable () {
      return {
        headers: this.headers,
        items: this.invoicesFormatted,
        loading: this.loadingList,
        serverItemsLength: 1,
        footerProps: {
          disableItemsPerPage: true,
          itemsPerPageOptions: [-1],
          options: {
            page: this.page
          }
        }
      }
    },

    getPageText () {
      const year = new Date().getFullYear()

      return `${year + 1 - this.page}`
    }
  },

  mounted () {
    this.loadInvoices({
      page: this.page
    })
  },

  methods: {
    ...mapActions({
      invoicesLoad: 'invoices/invoicesLoad',
      notificationShow: 'notifications/show'
    }),

    async loadInvoices ({
      page
    }) {
      this.loadingList = true

      try {
        const {
          invoices,
          total
        } = await this.invoicesLoad({
          page
        })
        this.invoices = invoices
        this.total = total
      } finally {
        this.loadingList = false
      }
    },

    onPageChange (page) {
      this.loadInvoices({
        page
      })
    },

    onCopy (text, field) {
      this.$copyToClipboard(text)

      this.notificationShow({
        type: 'success',
        message: `${field ? `${field} copied` : 'Copied'} to clipboard!`
      })
    },

    onOpenInvoice (invoice) {
      this.$router.push(this.$routes.paymentInvoiceId(invoice.invoiceId).route)
    }
  },

  head () {
    return {
      title: this.$routes.paymentInvoices.title
    }
  }
}
</script>
