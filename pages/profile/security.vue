<template>
  <v-layout column>
    <title-anchored
      anchor="security"
    >
      <h1 class="display-1 mb-3 px-4">
        Security
      </h1>
    </title-anchored>

    <v-row>
      <a-column
        cols="12"
        sm="12"
        md="6"
      >
        <password-change />
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import PasswordChange from '~/components/sections/security/PasswordChange'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewProfileSecurity',

  components: {
    TitleAnchored,
    PasswordChange
  },

  head () {
    return {
      title: this.$routes.profileSecurity.title
    }
  }
}
</script>
