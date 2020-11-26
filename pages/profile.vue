<template>
  <v-layout column>
    <v-card>
      <v-card-title>
        <h1 class="display-1 mb-3">
          Profile
        </h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            sm="12"
            md="6"
            lg="4"
          >
            <div class="mb-5">
              <v-avatar
                v-if="profile.picture"
                color="accent"
                size="240"
                class="mb-5"
              >
                <img
                  :src="profile.picture"
                  alt="Profile photo"
                >
              </v-avatar>

              <input
                ref="photoSelect"
                type="file"
                accept="image/*"
                hidden
                @input="onPhotoSelected"
              >

              <v-btn
                color="primary"
                @click="onSelectPhoto"
              >
                {{ profile.picture ? 'Change' : 'Set' }} profile photo
              </v-btn>
            </div>

            <form
              @submit.prevent="onSubmit"
            >
              <v-text-field
                v-model="profile.email"
                label="Email"
                disabled
              />

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
                :error="$v.userData.givenName"
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
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { pick } from 'lodash'

export default {
  name: 'ViewProfile',

  data () {
    return {
      isLoading: false,

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
      profilePhotoUpdate: 'user/profilePhotoUpdate',
      notificationShow: 'notifications/show'
    }),

    async onSubmit () {
      this.isLoading = true

      try {
        if (this.$v.userData.$invalid) {
          return this.$v.userData.$touch()
        }

        await this.profileUpdate({
          ...this.userData
        })

        this.notificationShow({
          type: 'success',
          message: 'Profile updated!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to update profile'
        })

        throw err
      } finally {
        this.isLoading = false
      }
    },

    onSelectPhoto () {
      this.$refs.photoSelect?.click()
    },

    async onPhotoSelected (e) {
      const file = e.target.files[0]

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
          message: 'Unable to update profile photo'
        })

        throw err
      }
    }
  },

  head () {
    return {
      title: this.$routes.profile.title
    }
  },

  validations () {
    return {
      userData: {
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
