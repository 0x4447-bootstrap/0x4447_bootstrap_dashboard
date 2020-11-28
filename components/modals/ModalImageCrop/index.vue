<template>
  <v-dialog
    :value="isOpen"
    max-width="992"
    @input="setIsOpen"
  >
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Edit image
      </v-card-title>

      <v-card-text>
        <div class="py-6">
          <vue-cropper
            ref="imageCropper"
            style="max-height: 500px"
            v-bind="optionsCropper"
          />
        </div>
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
          text
          @click="onSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueCropper from 'vue-cropperjs'

export default {
  name: 'ModalImageCrop',

  components: {
    VueCropper
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },

    imageSrc: {
      type: String,
      default: ''
    }
  },

  computed: {
    optionsCropper () {
      return {
        aspectRation: '16 / 9'
      }
    }
  },

  watch: {
    imageSrc: {
      immediate: true,
      handler (imageSrc) {
        if (!imageSrc) {
          return
        }

        setTimeout(() => {
          this.$refs.imageCropper?.replace(this.imageSrc)
        }, 0)
      }
    }
  },

  methods: {
    setIsOpen (value = false) {
      this.$emit('update:is-open', value)
    },

    resetImage () {
      this.$refs.imageCropper?.reset()
    },

    onCancel () {
      this.setIsOpen(false)
      this.resetImage()
    },

    onSave () {
      this.$refs.imageCropper.getCroppedCanvas().toBlob((blob) => {
        this.$emit('done', blob)
        this.setIsOpen(false)
        this.resetImage()
      })
    }
  }
}
</script>
