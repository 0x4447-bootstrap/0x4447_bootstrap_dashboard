<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Address
        </h1>
      </v-card-title>

      <v-card-text>
        <profile-address />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ProfileAddress from '~/components/sections/profile/ProfileAddress'

export default {
  name: 'ViewProfile',

  components: {
    ProfileAddress
  },

  head () {
    return {
      title: this.$routes.profileAddress.title
    }
  }
}
</script>
