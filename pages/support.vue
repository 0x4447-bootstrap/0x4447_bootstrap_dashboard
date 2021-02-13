<template>
  <v-layout column>
    <page-title
      :title="$routes.support.title"
      anchor="support"
    />

    <v-row>
      <a-column>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <support-steps />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import SupportSteps from '~/components/sections/support/SupportSteps'

export default {
  name: 'ViewSupport',

  components: {
    SupportSteps
  },

  head () {
    return {
      title: this.$routes.support.title
    }
  }
}
</script>
