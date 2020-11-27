<template>
  <div
    :class="classesWrapper"
    class="a-validation__container"
    @click="onResetError"
  >
    <slot
      name="default"
      :has-error="hasValidationError"
      :error="error"
      :error-message="errorMessage"
    />
  </div>
</template>

<script>
import errorMessages from '~/plugins/vuelidate/messages'

export default {
  name: 'AValidation',

  props: {
    error: {
      type: Object,
      default: () => ({})
    },

    customMessage: {
      type: String,
      default: ''
    },

    hideError: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    hasValidationError () {
      return this.error?.$error
    },

    showValidationError () {
      return this.hasValidationError && !this.hideError
    },

    errorMessage () {
      if (!this.hasValidationError) {
        return ''
      }

      const validationErrors = this.collectValidationErrors()

      if (validationErrors.length > 0) {
        return validationErrors[0]
      }

      return this.customMessage
    },

    classesWrapper () {
      return [
        { 'has-validation-error': this.hasValidationError }
      ]
    }
  },

  methods: {
    collectValidationErrors () {
      if (this.error.$params === undefined &&
        Object.keys(this.error.$params).length === 0
      ) {
        return []
      }

      const errorParams = Object.keys(this.error.$params).reduce((result, param) => {
        if (this.error[param] === false) {
          result.push(param)
        }

        return result
      }, [])

      return errorParams.map((validatorName) => {
        const customParam = this.error.$params[validatorName]?.param
        const customMessage = this.error.$params[validatorName]?.message
        const validator = errorMessages.find(validation => validation.validator === validatorName)

        if (!validator && !customMessage) {
          // eslint-disable-next-line no-console
          console.warn('Validation message is missing')
          return null
        }

        const message = customMessage || validator?.message
        return !customParam ? message : message.replace('%param%', customParam)
      }).filter(validation => validation)
    },

    onResetError () {
      if (this.hasValidationError) {
        this.error.$reset()
      }
    }
  }
}
</script>
