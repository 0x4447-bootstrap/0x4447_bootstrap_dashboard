<template>
  <v-dialog
    :value="isOpen"
    max-width="480"
    @input="setIsOpen"
  >
    <form
      @submit.prevent="onConfirm"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure?
        </v-card-title>

        <v-card-text
          v-if="$scopedSlots.message"
          class="pb-5"
        >
          <slot name="message" />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            type="submit"
            text
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalConfirm',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setIsOpen (value = false) {
      this.$emit('update:is-open', value)
    },

    onCancel () {
      this.setIsOpen(false)
    },

    onConfirm () {
      this.$emit('confirm')

      this.setIsOpen(false)
    }
  }
}
</script>
