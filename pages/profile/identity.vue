<template>
  <v-layout column>
    <title-anchored
      anchor="identity"
    >
      <h1 class="display-1 mb-3 px-4">
        Identity
      </h1>
    </title-anchored>

    <v-row>
      <a-column
        cols="12"
        sm="12"
        md="6"
      >
        <profile-details />

        <password-change />
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import ProfileDetails from '~/components/sections/profile/ProfileDetails'
import PasswordChange from '~/components/sections/profile/PasswordChange'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewProfile',

  components: {
    TitleAnchored,
    ProfileDetails,
    PasswordChange
  },

  head () {
    return {
      title: this.$routes.profileIdentity.title
    }
  }
}
</script>
