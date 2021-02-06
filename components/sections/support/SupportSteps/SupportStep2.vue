<template>
  <v-form
    @submit.prevent="onSave"
  >
    <a-validation
      v-slot="{ hasError, errorMessage }"
      :error="$v.supportForm.expectation"
    >
      <v-textarea
        v-model="supportForm.expectation"
        :error="hasError"
        :error-messages="errorMessage"
        autofocus
        name="support-issue"
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
</template>

<script>
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { minWordsValidator } from '~/plugins/vuelidate/validators'

export default {
  name: 'SupportStep2',

  data () {
    return {
      loading: false,

      supportForm: {
        expectation: ''
      }
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    async onSave () {
      if (this.$v.supportForm.$invalid) {
        return this.$v.supportForm.$touch()
      }

      this.loading = true

      try {
        await new Promise(resolve => setTimeout(resolve, 2000))

        this.notificationShow({
          type: 'success',
          message: 'Your message has been sent!'
        })

        this.$emit('step:next')
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to send a contact form'
        })
      } finally {
        this.loading = false
      }
    }
  },

  validations: {
    supportForm: {
      expectation: {
        required,
        minLengthWords: minWordsValidator(10)
      }
    }
  }
}
</script>
