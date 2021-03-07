<template>
  <div class="step-2__container">
    <div class="subtitle-1">
      <h4 class="text-center text-h5 mb-3">
        Preview
      </h4>

      <div class="step-2__preview">
        <p>
          <strong>Issue:</strong> {{ supportForm.issue }}
        </p>

        <p>
          <strong>Expectation:</strong> {{ supportForm.expectation }}
        </p>
      </div>
    </div>

    <div>
      <v-btn
        class="mr-3"
        text
        @click="onBack"
      >
        Back
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        @click="onNext"
      >
        Next
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportStep3',

  props: {
    supportForm: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    onNext () {
      this.$emit('step:next')
    },

    onBack () {
      this.$emit('step:previous')
    }
  }
}
</script>

<style lang="scss">
.step-2 {
  &__container {
    min-height: 220px;
    display: flex;
    flex-flow: column;
    align-content: center;
    justify-content: space-between;
  }

  &__preview {
    max-width: 480px;
    margin: 0 auto;
  }
}
</style>
