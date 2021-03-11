<template>
  <div class="profile-details__container">
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="6"
        lg="auto"
      >
        <v-card
          height="100%"
          class="profile-details-avatar__container"
        >
          <v-card-text class="profile-details-avatar__inner">
            <div class="d-flex justify-center justify-lg-start mb-4">
              <v-avatar
                size="160"
                color="grey darken-1"
              >
                <v-img
                  :lazy-src="avatarPlaceholder"
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
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="4"
        class="d-flex"
      >
        <v-card class="profile-details__card">
          <v-card-text class="profile-details__card__inner">
            <form
              class="profile-details__form"
              @submit.prevent="onUpdateProfile"
            >
              <div class="profile-details__form__inner">
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
                  :error="$v.userData.email"
                >
                  <v-text-field
                    v-model="userData.email"
                    :error="hasError"
                    :error-messages="errorMessage"
                    label="Email"
                  />
                </a-validation>
              </div>

              <v-btn
                :loading="isLoading"
                type="submit"
                color="primary"
              >
                Save
              </v-btn>
            </form>
          </v-card-text>
        </v-card>

        <modal-verify-email
          :is-open.sync="isModalVerifyEmailOpen"
        />
      </v-col>

      <v-col
        cols="12"
        lg="auto"
        class="flex-grow-1"
      >
        <v-card
          width="100%"
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="2"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        lg="7"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="5"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        lg="3"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          height="100%"
          min-height="224px"
        >
          <v-card-text />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { pick } from 'lodash'
import { required, email } from 'vuelidate/lib/validators'
import ModalImageCrop from '~/components/modals/ModalImageCrop'
import ModalVerifyEmail from '~/components/modals/ModalVerifyEmail'
import { avatarPlaceholder } from '~/assets/images'

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
      avatarPlaceholder,

      userData: {
        givenName: ''
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
          'givenName'
        ])
      }
    }
  },

  methods: {
    ...mapActions({
      emailVerificationRequest: 'auth/emailVerificationRequest',
      profileUpdate: 'user/profileUpdate',
      profilePhotoUpdate: 'user/profilePhotoUpdate',
      notificationShow: 'notifications/show',
      createUserRecord: 'auth/createUserRecord'
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
          message: 'Profile has been updated!'
        })

        if (hasEmailChanged) {
          await this.emailVerificationRequest()
          this.isModalVerifyEmailOpen = true

          await this.createUserRecord({
            sub: this.profile.id,
            email: this.userData.email
          })
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
        }
      }
    }
  }
}
</script>

<style lang="scss">
.profile-details-avatar {
  &__container {
    width: 100%;
  }

  &__inner {
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;
  }

  @media (min-width: 1264px) {
    &__container {
      width: 192px;
    }
  }
}

.profile-details {
  &__container {
    margin-bottom: 200px;
  }

  &__card {
    width: 100%;
  }

  &__card__inner {
    height: 100%;
  }

  &__form {
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__form__inner {
    width: 100%;
  }
}
</style>
