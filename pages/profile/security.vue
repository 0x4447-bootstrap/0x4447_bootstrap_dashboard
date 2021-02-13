<template>
  <v-layout column>
    <page-title
      :title="$routes.profileSecurity.title"
      anchor="security"
    />

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

export default {
  name: 'ViewProfileSecurity',

  components: {
    PasswordChange
  },

  head () {
    return {
      title: this.$routes.profileSecurity.title
    }
  }
}
</script>
