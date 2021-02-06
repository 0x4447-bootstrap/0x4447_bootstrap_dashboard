<template>
  <v-layout column>
    <title-anchored
      anchor="support"
    >
      <h1 class="display-1 mb-3 px-4">
        Support
      </h1>
    </title-anchored>

    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <support-steps />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import TitleAnchored from '~/components/general/TitleAnchored'
import SupportSteps from '~/components/sections/support/SupportSteps'

export default {
  name: 'ViewSupport',

  components: {
    TitleAnchored,
    SupportSteps
  },

  head () {
    return {
      title: this.$routes.support.title
    }
  }
}
</script>
