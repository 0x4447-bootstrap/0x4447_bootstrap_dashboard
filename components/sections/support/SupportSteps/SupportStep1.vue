<template>
  <v-form
    @submit.prevent="onSave"
  >
    <a-validation
      v-slot="{ hasError, errorMessage }"
      :error="$v.supportForm.issue"
    >
      <v-textarea
        v-model="supportForm.issue"
        :error="hasError"
        :error-messages="errorMessage"
        autofocus
        name="support-issue"
        label="Describe your problem"
      />
    </a-validation>

    <v-btn
      color="primary"
      type="submit"
    >
      Save
    </v-btn>
  </v-form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { minWordsValidator } from '~/plugins/vuelidate/validators'

export default {
  name: 'SupportStep1',

  data () {
    return {
      supportForm: {
        issue: ''
      }
    }
  },

  methods: {
    onSave () {
      if (this.$v.supportForm.$invalid) {
        return this.$v.supportForm.$touch()
      }

      this.$emit('step:next', this.supportForm)
    }
  },

  validations () {
    return {
      supportForm: {
        issue: {
          required,
          minLengthWords: minWordsValidator(10)
        }
      }
    }
  }
}
</script>
