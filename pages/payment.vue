<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Payment
        </h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            sm="12"
            md="auto"
          >
            Coming soon
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'ViewPayment',

  head () {
    return {
      title: this.$routes.payment.title
    }
  }
}
</script>
