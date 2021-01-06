<template>
  <v-layout column>
    <title-anchored
      anchor="address"
    >
      <h1 class="display-1 mb-3 px-4">
        Address
      </h1>
    </title-anchored>
    <v-card>
      <v-card-text>
        <profile-address />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ProfileAddress from '~/components/sections/profile/ProfileAddress'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewProfile',

  components: {
    ProfileAddress,
    TitleAnchored
  },

  head () {
    return {
      title: this.$routes.profileAddress.title
    }
  }
}
</script>
