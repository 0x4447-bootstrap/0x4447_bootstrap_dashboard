<template>
  <v-row class="mb-5">
    <v-col
      cols="12"
      sm="12"
      md="6"
      lg="auto"
    >
      <div class="d-flex justify-center justify-lg-start mb-2 px-6">
        <v-avatar
          v-if="profile.picture"
          color="accent"
          size="160"
          class="mb-5"
        >
          <v-img
            :src="profile.picture"
            alt="Profile photo"
          />
        </v-avatar>
      </div>

      <div class="d-flex justify-center">
        <input
          ref="photoSelect"
          type="file"
          accept="image/*"
          hidden
          @input="onPhotoSelected"
        >

        <v-btn
          :loading="isLoadingPhoto"
          color="primary"
          small
          @click="onSelectPhoto"
        >
          {{ profile.picture ? 'Change' : 'Set' }} avatar
        </v-btn>
      </div>

      <modal-image-crop
        :is-open.sync="isModalCropOpen"
        :image-src.sync="selectedImageFile"
        @done="onProfilePhotoUpdate"
      />
    </v-col>

    <v-col
      xs="12"
      md="6"
      lg="4"
    >
      <form
        @submit.prevent="onUpdateProfile"
      >
        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userData.email"
        >
          <v-text-field
            v-model="userData.email"
            :error="hasError"
            :error-messages="errorMessage"
            label="Email"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userData.givenName"
        >
          <v-text-field
            v-model="userData.givenName"
            :error="hasError"
            :error-messages="errorMessage"
            label="First name"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userData.familyName"
        >
          <v-text-field
            v-model="userData.familyName"
            :error="hasError"
            :error-messages="errorMessage"
            label="Last name"
          />
        </a-validation>

        <v-btn
          :loading="isLoading"
          type="submit"
          color="primary"
        >
          Save
        </v-btn>
      </form>

      <modal-verify-email
        :is-open.sync="isModalVerifyEmailOpen"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { pick } from 'lodash'
import { required, email } from 'vuelidate/lib/validators'
import ModalImageCrop from '~/components/modals/ModalImageCrop'
import ModalVerifyEmail from '~/components/modals/ModalVerifyEmail'

export default {
  name: 'ProfileDetails',

  components: {
    ModalVerifyEmail,
    ModalImageCrop
  },

  data () {
    return {
      isLoading: false,
      isLoadingPhoto: false,

      userData: {
        givenName: '',
        familyName: ''
      },

      selectedImageFile: '',
      isModalCropOpen: false,
      isModalVerifyEmailOpen: false
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
          'email',
          'givenName',
          'familyName'
        ])
      }
    }
  },

  methods: {
    ...mapActions({
      requestEmailVerification: 'auth/requestEmailVerification',
      profileUpdate: 'user/profileUpdate',
      profilePhotoUpdate: 'user/profilePhotoUpdate',
      notificationShow: 'notifications/show'
    }),

    async onUpdateProfile () {
      this.isLoading = true

      try {
        if (this.$v.userData.$invalid) {
          return this.$v.userData.$touch()
        }

        const hasEmailChanged = this.userData.email.toLowerCase() !== this.profile.email.toLowerCase()

        await this.profileUpdate({
          ...this.userData
        })

        this.notificationShow({
          type: 'success',
          message: 'Profile updated!'
        })

        if (hasEmailChanged) {
          await this.requestEmailVerification()
          this.isModalVerifyEmailOpen = true
        }
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to update profile'
        })
      } finally {
        this.isLoading = false
      }
    },

    onSelectPhoto () {
      this.$refs.photoSelect?.click()
    },

    onPhotoSelected (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.selectedImageFile = event.target.result
        this.isModalCropOpen = true
      }

      reader.readAsDataURL(file)
    },

    async onProfilePhotoUpdate (file) {
      this.isLoadingPhoto = true

      try {
        await this.profilePhotoUpdate({
          file
        })

        this.notificationShow({
          type: 'success',
          message: 'Profile photo updated!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to update profile photo'
        })
      } finally {
        this.isLoadingPhoto = false
      }
    }
  },

  validations () {
    return {
      userData: {
        email: {
          required,
          email
        },
        givenName: {
          required
        },
        familyName: {
          required
        }
      }
    }
  }
}
</script>
