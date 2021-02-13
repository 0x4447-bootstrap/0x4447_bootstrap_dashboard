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
        :counter="true"
        autofocus
        name="support-issue"
        label="Describe your problem"
      >
        <template #counter>
          <div>
            Words: {{ wordsCharCounter.words }}
            Characters: {{ wordsCharCounter.characters }}
          </div>
        </template>
      </v-textarea>
    </a-validation>

    <v-btn
      color="primary"
      type="submit"
    >
      Next
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

  computed: {
    wordsCharCounter () {
      const words = this.supportForm.issue
      return {
        words: words ? words.split(' ').length : 0,
        characters: words.length
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
