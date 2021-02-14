<template>
  <v-form
    @submit.prevent="onNext"
  >
    <a-validation
      v-slot="{ hasError, errorMessage }"
      :error="$v.supportForm.expectation"
    >
      <v-textarea
        v-model="supportForm.expectation"
        :error="hasError"
        :error-messages="errorMessage"
        counter
        autofocus
        name="support-issue"
        label="Describe your expectation"
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
      :loading="loading"
      color="primary"
      type="submit"
      class="mr-3"
    >
      Next
    </v-btn>

    <v-btn
      text
      @click="onBack"
    >
      Back
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

  computed: {
    wordsCharCounter () {
      const words = this.supportForm.expectation
      return {
        words: words ? words.split(' ').length : 0,
        characters: words.length
      }
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    onNext () {
      if (this.$v.supportForm.$invalid) {
        return this.$v.supportForm.$touch()
      }

      this.$emit('step:next', this.supportForm)
    },

    onBack () {
      this.$emit('step:previous')
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
