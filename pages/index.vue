<template>
  <v-layout column>
    <page-title
      :title="$routes.dashboard.title"
    />

    <v-row>
      <a-column>
        <v-card>
          <v-card-text>
            <v-row>
              <a-column
                sm="12"
                md="auto"
              >
                Welcome!
              </a-column>
            </v-row>
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
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
