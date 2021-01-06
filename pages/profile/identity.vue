<template>
  <v-layout column>
    <title-anchored
      anchor="identity"
    >
      <h1 class="display-1 mb-3 px-4">
        Identity
      </h1>
    </title-anchored>

    <v-card>
      <v-card-text>
        <profile-details />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ProfileDetails from '~/components/sections/profile/ProfileDetails'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewProfile',

  components: {
    TitleAnchored,
    ProfileDetails
  },

  head () {
    return {
      title: this.$routes.profileIdentity.title
    }
  }
}
</script>
