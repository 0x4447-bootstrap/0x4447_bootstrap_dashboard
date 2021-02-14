<template>
  <v-layout column>
    <page-title
      :title="$routes.paymentInvoices.title"
      anchor="invoices"
    />

    <v-row>
      <a-column
        cols="12"
      >
        <v-card>
          <v-card-text>
            <v-data-table
              :page.sync="page"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
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
              </template>

              <template
                #item.invoiceId="{ item } "
              >
                {{ item.invoiceId || '-' }}

                <v-btn
                  v-if="item.invoiceId"
                  icon
                  ml="4"
                  small
                  @click.stop="onCopy(item.invoiceId, 'Invoice ID')"
                >
                  <v-icon small>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>

              <template
                #item.chargeId="{ item } "
              >
                {{ item.chargeId || '-' }}

                <v-btn
                  v-if="item.chargeId"
                  icon
                  ml="4"
                  small
                  @click.stop="onCopy(item.chargeId, 'Charge ID')"
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
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import arraySort from 'array-sort'
import { isArray } from 'lodash'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

export default {
  name: 'ViewPaymentIndex',

  data () {
    return {
      page: 1,
      total: 0,

      loadingList: true,
      headers: [
        {
          text: 'Created',
          value: 'created'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Paid',
          value: 'paid'
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
          value: 'next_payment_attempt'
        }
      ],
      sortBy: 'created',
      sortDesc: true,
      invoices: []
    }
  },

  computed: {
    invoicesFormatted () {
      const sortDesc = isArray(this.sortDesc) ? this.sortDesc[0] : this.sortDesc
      return arraySort(this.invoices.map(invoice => ({
        created: invoice.created ? format(parseISO(invoice.created), 'MM/dd/yyyy, hh:mm:ss a') : 'N/A',
        amount_paid: invoice.amount_paid,
        amount: invoice.amount_paid ? `${invoice.amount_paid / 100} ${invoice.currency}` : '-',
        paid: invoice.paid,
        invoiceId: invoice.stripe_invoice_id,
        chargeId: invoice.charge_id,
        next_payment_attempt: invoice.next_payment_attempt
          ? format(parseISO(invoice.next_payment_attempt), 'MM/dd/yyyy, hh:mm:ss a')
          : ''
      })), this.sortBy, {
        reverse: sortDesc
      })
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

      return `Data for year ${year + 1 - this.page}`
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
