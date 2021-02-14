<template>
  <v-row>
    <v-col>
      <title-anchored
        v-if="anchor"
        :anchor="anchor"
      >
        <h1 class="display-1 px-4">
          {{ title }}
        </h1>
      </title-anchored>

      <h1
        v-else
        class="display-1 px-4"
      >
        {{ title }}
      </h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PageTitle',

  props: {
    anchor: {
      type: String,
      default: ''
    },

    title: {
      type: String,
      default: ''
    }
  }
}
</script>
