<template>
  <v-row class="mt-5">
    <a-column
      cols="12"
      class="mb-5 mb-md-0"
    >
      <v-card width="100%">
        <v-card-text>
          <h4 class="text-h5">
            Change password
          </h4>

          <form
            class="profile-password__form"
            @submit.prevent="onSubmit"
          >
            <div>
              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.passwords.current"
              >
                <v-text-field
                  v-model="passwords.current"
                  :error="hasError"
                  :error-messages="errorMessage"
                  type="password"
                  label="Current password"
                />
              </a-validation>

              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.passwords.new"
              >
                <v-text-field
                  v-model="passwords.new"
                  :error="hasError"
                  :error-messages="errorMessage"
                  type="password"
                  label="New password"
                />
              </a-validation>

              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.passwords.newConfirm"
              >
                <v-text-field
                  v-model="passwords.newConfirm"
                  :error="hasError"
                  :error-messages="errorMessage"
                  type="password"
                  label="Repeat new password"
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
    </a-column>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { required, helpers } from 'vuelidate/lib/validators'

export default {
  name: 'PasswordChange',

  data () {
    return {
      passwords: {
        current: '',
        new: '',
        newConfirm: ''
      },

      isLoading: false
    }
  },

  methods: {
    ...mapActions({
      passwordChange: 'user/passwordChange',
      notificationShow: 'notifications/show'
    }),

    async onSubmit () {
      this.isLoading = true

      try {
        if (this.$v.passwords.$invalid) {
          return this.$v.passwords.$touch()
        }

        await this.passwordChange(this.passwords)

        this.notificationShow({
          type: 'success',
          message: 'Password has been changed!'
        })

        this.resetForm()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to change password'
        })
      } finally {
        this.isLoading = false
      }
    },

    resetForm () {
      Object.keys(this.passwords).forEach((key) => {
        this.passwords[key] = ''
      })
      this.$v.passwords.$reset()
    }
  },

  validations: {
    passwords: {
      current: {
        required
      },
      new: {
        required
      },
      newConfirm: {
        required,
        sameAs: helpers.withParams({
          message: 'Should be the same as new password'
        }, function (value) {
          return value === this.passwords.new
        })
      }
    }
  }
}
</script>

<style lang="scss">
.profile-password {
  @media (min-width: 960px) {
    &__form {
      max-width: 320px;
    }
  }
}
</style>
