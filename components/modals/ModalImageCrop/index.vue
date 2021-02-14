<template>
  <v-dialog
    :value="isOpen"
    max-width="992"
    @input="setIsOpen"
  >
    <v-card>
      <v-card-title class="headline">
        Edit image
      </v-card-title>

      <v-card-text>
        <div class="py-6">
          <v-row>
            <v-col
              cols="12"
              md="9"
            >
              <h3 class="text-h6">
                Select area to crop
              </h3>

              <vue-cropper
                ref="imageCropper"
                style="max-height: 500px"
                v-bind="optionsCropper"
              />
            </v-col>

            <v-col>
              <h3 class="text-h6 text-center">
                Preview
              </h3>

              <div
                id="imageCropPreview"
                style="width: 160px; height: 160px; overflow: hidden; border-radius: 50%; margin: 0 auto;"
              />
            </v-col>
          </v-row>
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
        aspectRatio: 1,
        preview: '#imageCropPreview'
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

<style>
/*
* Fix for an empty box in the corner of vue-cropperjs container
*/
.cropper-bg {
  background-image: none;
}
</style>
