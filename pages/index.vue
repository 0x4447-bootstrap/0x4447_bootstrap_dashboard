<template>
  <v-layout column>
    <title-anchored
      anchor="dashboard"
    >
      <h1 class="display-1 mb-3 px-4">
        Dashboard
      </h1>
    </title-anchored>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            sm="12"
            md="auto"
            class="py-0"
          >
            Welcome!
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewDashboard',

  components: {
    TitleAnchored
  },

  head () {
    return {
      title: this.$routes.dashboard.title
    }
  }
}
</script>
