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

      <v-stepper-step step="3">
        Submit
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
        />
      </v-stepper-content>

      <v-stepper-content step="3">
        <support-step3 />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions } from 'vuex'
import SupportStep1 from './SupportStep1'
import SupportStep2 from './SupportStep2'
import SupportStep3 from './SupportStep3'

export default {
  name: 'SupportSteps',

  components: {
    SupportStep1,
    SupportStep2,
    SupportStep3
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
    },

    isStepComplete (stepIndex) {
      return this.step > stepIndex
    }
  }
}
</script>
