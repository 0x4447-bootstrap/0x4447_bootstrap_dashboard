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
          <a-column
            cols="12"
            md="6"
          >
            <v-form
              @submit.prevent="onSubmit"
            >
              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.supportForm.issue"
              >
                <v-textarea
                  v-model="supportForm.issue"
                  :error="hasError"
                  :error-messages="errorMessage"
                  name="support-issue"
                  label="Describe your problem"
                />
              </a-validation>

              <a-validation
                v-slot="{ hasError, errorMessage }"
                :error="$v.supportForm.expectation"
              >
                <v-textarea
                  v-model="supportForm.expectation"
                  :error="hasError"
                  :error-messages="errorMessage"
                  :disabled="$v.supportForm.issue.$invalid"
                  name="support-expectation"
                  label="Describe your expectation"
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
          </a-column>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { required, helpers } from 'vuelidate/lib/validators'
import TitleAnchored from '~/components/general/TitleAnchored'

function minWordsValidator (minWords = 10) {
  return helpers.withParams({
    message: `Should have at least ${minWords} words`
  }, (value) => {
    return value && `${value}`.split(' ').length >= minWords
  })
}

export default {
  name: 'ViewSupport',

  components: {
    TitleAnchored
  },

  data () {
    return {
      supportForm: {
        issue: '',
        expectation: ''
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
      this.supportForm.issue = ''
      this.supportForm.expectation = ''
      this.$v.supportForm.$reset()
    }
  },

  validations () {
    return {
      supportForm: {
        issue: {
          required,
          minLengthWords: minWordsValidator(10)
        },
        expectation: {
          required,
          minLengthWords: minWordsValidator(10)
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
