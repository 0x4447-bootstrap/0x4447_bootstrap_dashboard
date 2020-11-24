<template>
  <div>
    <h1>Profile</h1>

    <p>
      This is your Profile page where you can edit every aspect of your account.
    </p>

    <div>
      <label for="profileAvatar">
        Profile picture
      </label>

      <img
        v-if="profile.picture"
        style="max-width:150px;"
        :src="profile.picture"
        alt="Profile picture"
      >

      <input
        id="profileAvatar"
        type="file"
        accept="image/*"
        @input="onPhotoSelected"
      >
    </div>

    <form
      @submit.prevent="onSubmit"
    >
      <div>
        <label for="profileEmail">
          Email
        </label>
        <input
          id="profileEmail"
          :value="profile.email"
          disabled
          type="text"
        >
      </div>

      <div>
        <label for="profileFirstName">
          First name
        </label>
        <input
          id="profileFirstName"
          v-model="userData.givenName"
          type="text"
        >
      </div>

      <div>
        <label for="profileLastName">
          Last name
        </label>

        <input
          v-model="userData.familyName"
          id="profileLastName"
          type="text"
        >
      </div>

      <button
        type="submit"
      >
        Save
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { pick } from 'lodash'

export default {
  name: 'ViewProfile',

  data () {
    return {
      userData: {
        givenName: '',
        familyName: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      profile: 'user/profile'
    })
  },

  watch: {
    profile: {
      immediate: true,
      handler (profile) {
        this.userData = pick(profile, [
          'givenName',
          'familyName'
        ])
      }
    }
  },

  methods: {
    ...mapActions({
      profileUpdate: 'user/profileUpdate',
      profilePhotoUpdate: 'user/profilePhotoUpdate'
    }),

    async onSubmit () {
      try {
        await this.profileUpdate({
          ...this.userData
        })

        // TODO handle success
      } catch (err) {
        console.error(err)

        // TODO handle error
        throw err
      }
    },

    async onPhotoSelected (e) {
      const file = e.target.files[0]

      await this.profilePhotoUpdate({
        file
      })
    }
  },

  head () {
    return {
      title: this.$routes.profile.title
    }
  }
}
</script>
