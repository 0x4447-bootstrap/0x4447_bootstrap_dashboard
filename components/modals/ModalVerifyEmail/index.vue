<template>
  <v-dialog
    :value="isOpen"
    max-width="480"
    @input="setIsOpen"
  >
    <form
      @submit.prevent="onSubmit"
    >
      <v-card>
        <v-card-title class="headline">
          Verify Email
        </v-card-title>

        <v-card-text>
          <div class="py-6">
            <p class="text-center">
              Enter the confirmation code that has been sent to your email ({{ profile.email }})
            </p>

            <a-validation
              v-slot="{ hasError, errorMessage }"
              :error="$v.verificationCode"
            >
              <v-text-field
                v-model="verificationCode"
                :error="hasError"
                :error-messages="errorMessage"
                label="Verification code"
              />
            </a-validation>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>

          <v-spacer />

          <v-btn
            :loading="isLoading"
            color="primary"
            type="submit"
            text
          >
            Verify
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
import { helpers, required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ModalVerifyEmail',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      verificationCode: '',
      isLoading: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'user/profile'
    })
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show',
      emailVerificationConfirm: 'auth/emailVerificationConfirm'
    }),

    setIsOpen (value = false) {
      this.$emit('update:is-open', value)
    },

    onCancel () {
      this.setIsOpen(false)
    },

    async onSubmit () {
      if (this.$v.verificationCode.$invalid) {
        return this.$v.verificationCode.$touch()
      }

      this.isLoading = true

      try {
        await this.emailVerificationConfirm({
          code: this.verificationCode
        })

        this.notificationShow({
          type: 'success',
          message: 'Email confirmed successfully!'
        })

        this.setIsOpen(false)
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: err.message || 'Unable to verify email'
        })
      } finally {
        this.isLoading = false
      }
    }
  },

  validations: {
    verificationCode: {
      required,
      lengthWithParam: helpers.withParams({
        param: 6
      }, (val) => {
        return val?.length === 6
      })
    }
  }
}
</script>
