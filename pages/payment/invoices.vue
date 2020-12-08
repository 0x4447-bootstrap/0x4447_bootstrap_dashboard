<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Invoices
        </h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            cols="12"
          >
            <v-data-table
              :headers="headers"
              :items="invoicesFormatted"
              :items-per-page="perPage"
              :page="page"
              :loading="loadingList"
              :server-items-length="total"
              class="elevation-1"
              @update:page="onPageChange"
              @update:items-per-page="onPerPageChange"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import fromUnixTime from 'date-fns/fromUnixTime'
import format from 'date-fns/format'

export default {
  name: 'ViewPaymentIndex',

  data () {
    return {
      page: 1,
      perPage: 10,
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
          text: 'Invoice ID',
          value: 'invoiceId',
          sortable: false
        },
        {
          text: 'Charge Id',
          value: 'chargeId',
          sortable: false
        }
      ],
      invoices: []
    }
  },

  computed: {
    invoicesFormatted () {
      return this.invoices.map(invoice => ({
        created: invoice.created ? format(fromUnixTime(invoice.created), 'MM/dd/yyyy, hh:mm:ss a') : 'N/A',
        amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
        paid: invoice.paid ? 'Yes' : 'No',
        invoiceId: invoice.stripe_invoice_id?.substring(3) || 'N/A',
        chargeId: invoice.charge_id?.substring(3) || 'N/A'
      }))
    }
  },

  mounted () {
    this.loadInvoices({
      page: this.page,
      perPage: this.perPage
    })
  },

  methods: {
    ...mapActions({
      invoicesLoad: 'invoices/invoicesLoad'
    }),

    async loadInvoices ({ page, perPage }) {
      this.loadingList = true

      try {
        const { invoices, total } = await this.invoicesLoad({
          page,
          perPage
        })
        this.invoices = invoices
        this.total = total
      } catch (err) {

      } finally {
        this.loadingList = false
      }
    },

    onPageChange (page) {
      this.loadInvoices({
        page,
        perPage: this.perPage
      })
    },

    onPerPageChange (perPage) {
      this.loadInvoices({
        page: 1,
        perPage
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
