<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Profile
        </h1>
      </v-card-title>

      <v-card-text>
        <profile-details />

        <v-divider />

        <profile-address />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ProfileAddress from '~/components/sections/profile/ProfileAddress'
import ProfileDetails from '~/components/sections/profile/ProfileDetails'

export default {
  name: 'ViewProfile',

  components: {
    ProfileDetails,
    ProfileAddress
  },

  head () {
    return {
      title: this.$routes.profile.title
    }
  }
}
</script>
