<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Dashboard
        </h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            sm="12"
            md="auto"
          >
            Welcome!
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'ViewDashboard',

  head () {
    return {
      title: this.$routes.dashboard.title
    }
  }
}
</script>
