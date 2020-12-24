<template>
  <v-layout column>
    <h1 class="display-1 mb-3 px-3">
      Identity
    </h1>

    <v-card>
      <v-card-text>
        <profile-details />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ProfileDetails from '~/components/sections/profile/ProfileDetails'

export default {
  name: 'ViewProfile',

  components: {
    ProfileDetails
  },

  head () {
    return {
      title: this.$routes.profileIdentity.title
    }
  }
}
</script>
