<template>
  <v-layout column>
    <title-anchored
      anchor="support"
    >
      <h1 class="display-1 mb-3 px-4">
        Support
      </h1>
    </title-anchored>

    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-form
              @submit.prevent="onSubmit"
            >
              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.supportForm.message"
              >
                <v-textarea
                  v-model="supportForm.message"
                  :error="hasError"
                  :error-messages="errorMessage"
                  name="support-message"
                  label="Message"
                  placeholder="Enter your message"
                />
              </a-validation>

              <v-btn
                :loading="loading"
                color="primary"
                type="submit"
              >
                Send
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { required, helpers } from 'vuelidate/lib/validators'
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewSupport',

  components: {
    TitleAnchored
  },

  data () {
    return {
      supportForm: {
        message: ''
      },

      loading: false
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    onSubmit () {
      if (this.$v.supportForm.$invalid) {
        return this.$v.supportForm.$touch()
      }

      this.loading = true

      try {
        this.notificationShow({
          type: 'success',
          message: 'Your message has been sent!'
        })
        this.resetForm()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to send a contact form'
        })
      } finally {
        this.loading = false
      }
    },

    resetForm () {
      this.supportForm.message = ''
      this.$v.supportForm.$reset()
    }
  },

  validations () {
    const MESSAGE_MIN_WORDS = 10
    return {
      supportForm: {
        message: {
          required,
          minLengthWords: helpers.withParams({
            message: `Should have at least ${MESSAGE_MIN_WORDS} words`
          }, (value) => {
            return value && `${value}`.split(' ').length >= MESSAGE_MIN_WORDS
          })
        }
      }
    }
  },

  head () {
    return {
      title: this.$routes.support.title
    }
  }
}
</script>
