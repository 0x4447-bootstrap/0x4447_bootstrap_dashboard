<template>
  <v-col
    v-bind="$attrs"
    class="py-0"
  >
    <slot />
  </v-col>
</template>

<script>
export default {
  name: 'AColumn'
}
</script>
