<template>
  <v-layout column>
    <page-title
      :title="pageTitle"
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
              v-bind="bindingsTable"
              class="elevation-1 invoices__table"
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
                {{ item.invoiceId || 'N/A' }}

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
                {{ item.chargeId || 'N/A' }}

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

              <template #item.invoicePdf="{ item }">
                <v-btn
                  v-if="item.invoicePdf"
                  :href="item.invoicePdf"
                  icon
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>

              <template
                #footer.page-text
              >
                {{ getPageText }}
              </template>
            </v-data-table>

            <v-row class="pt-3">
              <v-spacer />

              <v-col
                sm="auto"
                class="d-flex align-center"
              >
                <v-btn
                  :disabled="disabledNextYear"
                  icon
                  @click="onNextYear"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>

                <div class="d-flex align-center">
                  {{ getPageText }}
                </div>

                <v-btn
                  :disabled="disabledPrevYear"
                  icon
                  @click="onPreviousYear"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
import { v4 as uuid } from 'uuid'

function formatInvoiceType (invoiceType) {
  let type = invoiceType.split('.')[1]

  if (!type) {
    return 'N/A'
  }

  type = type.replace(/_/g, ' ')

  return type.charAt(0).toUpperCase() + type.slice(1)
}

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
          value: 'created',
          sortable: false
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
          text: 'Type',
          value: 'type',
          sortable: false
        },
        {
          text: '',
          value: 'invoicePdf',
          sortable: false
        }
      ],
      invoices: [],

      currentYear: new Date().getFullYear(),
      year: new Date().getFullYear(),
      stats: {},
      serverItemsLength: 1
    }
  },

  computed: {
    pageTitle () {
      return `${this.$routes.paymentInvoices.title} for ${this.year}`
    },
    invoicesFormatted () {
      return this.invoices.map(invoice => ({
        created: invoice.created ? format(parseISO(invoice.created), 'MM/dd/yyyy, hh:mm:ss a') : 'N/A',
        amountDue: invoice.amount_due,
        amount: invoice.amount_due ? `${invoice.amount_due / 100}` : 'N/A',
        paid: invoice.amount_paid === invoice.amount_due,
        invoiceId: uuid(),
        invoicePdf: invoice.invoice_pdf,
        type: formatInvoiceType(invoice.type)
      }))
    },

    statsSum () {
      return Object.values(this.stats).reduce((sum, num) => num + sum, 0)
    },

    bindingsTable () {
      return {
        headers: this.headers,
        items: this.invoicesFormatted,
        loading: this.loadingList,
        serverItemsLength: 1,
        hideDefaultFooter: true
      }
    },

    getPageText () {
      return `${this.year} | ${this.year - 1}`
    },

    disabledNextYear () {
      return this.currentYear === this.year
    },

    disabledPrevYear () {
      return this.stats[this.year - 1] === 0
    }
  },

  mounted () {
    this.loadInvoices({
      year: this.year
    })
  },

  methods: {
    ...mapActions({
      invoicesLoad: 'invoices/invoicesLoad',
      invoicesStatsLoad: 'invoices/invoicesStatsLoad',
      notificationShow: 'notifications/show'
    }),

    async loadInvoices ({
      year
    }) {
      this.loadingList = true

      try {
        this.year = year
        const {
          invoices,
          total
        } = await this.invoicesLoad({
          year
        })

        this.stats = {
          ...this.stats,
          [year]: total
        }

        await this.loadNextPageStats(year - 1)
        this.invoices = invoices
      } finally {
        this.loadingList = false
      }
    },

    async loadNextPageStats (year) {
      // Next page stats
      if (this.stats[year] > 0) {
        return
      }

      const nextPageTotal = await this.invoicesStatsLoad({
        year
      })

      this.stats = {
        ...this.stats,
        [year]: nextPageTotal
      }

      if (nextPageTotal === 0) {
        this.serverItemsLength = this.statsSum
      }
    },

    onCopy (text, field) {
      this.$copyToClipboard(text)

      this.notificationShow({
        type: 'success',
        message: `${field ? `${field} copied` : 'Copied'} to clipboard!`
      })
    },

    onOpenInvoice (invoice) {
      // this.$router.push(this.$routes.paymentInvoiceId(invoice.invoiceId).route)
    },

    onNextYear () {
      this.loadInvoices({
        year: this.year + 1
      })
    },

    onPreviousYear () {
      this.loadInvoices({
        year: this.year - 1
      })
    }
  },

  head () {
    return {
      title: this.$routes.paymentInvoices.title
    }
  }
}
</script>

<style>
.invoices__table tr:hover {
  cursor: pointer;
}
</style>
