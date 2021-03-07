<template>
  <v-layout column>
    <page-title
      :title="$routes.profileIdentity.title"
      anchor="identity"
    />

    <v-row>
      <a-column
        cols="12"
        sm="12"
      >
        <profile-details />
      </a-column>
    </v-row>
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
