<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step
        :complete="isStepComplete(1)"
        step="1"
      >
        Your problem
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="isStepComplete(2)"
        step="2"
      >
        Your expectation
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="isStepComplete(3)"
        step="3"
      >
        Preview
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="isStepComplete(4)"
        step="4"
      >
        Submitting
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="isStepComplete(5)"
        step="5"
      >
        Confirmation
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <support-step1
          @step:next="onNextStep"
        />
      </v-stepper-content>

      <v-stepper-content step="2">
        <support-step2
          @step:next="onNextStep"
          @step:previous="onPreviousStep"
        />
      </v-stepper-content>

      <v-stepper-content step="3">
        <support-step3
          :support-form="supportForm"
          @step:next="onNextStep"
          @step:previous="onPreviousStep"
        />
      </v-stepper-content>

      <v-stepper-content step="4">
        <support-step4
          @step:next="onNextStep"
        />
      </v-stepper-content>

      <v-stepper-content step="5">
        <support-step5 />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions } from 'vuex'
import SupportStep1 from './SupportStep1'
import SupportStep2 from './SupportStep2'
import SupportStep3 from './SupportStep3'
import SupportStep4 from './SupportStep4'
import SupportStep5 from './SupportStep5'

export default {
  name: 'SupportSteps',

  components: {
    SupportStep1,
    SupportStep2,
    SupportStep3,
    SupportStep4,
    SupportStep5
  },

  data () {
    return {
      step: 1,

      supportForm: {
        issue: '',
        expectation: ''
      }
    }
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    onNextStep (updatedForm = {}) {
      this.supportForm = {
        ...this.supportForm,
        ...updatedForm
      }

      this.step = this.step + 1

      if (this.step === 4) {
        this.submitForm()
      }
    },

    onPreviousStep () {
      this.step = this.step - 1
    },

    isStepComplete (stepIndex) {
      return this.step > stepIndex
    },

    async submitForm () {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))

        this.onNextStep()
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to send a contact form'
        })

        this.onPreviousStep()
      }
    }
  }
}
</script>
