<template>
  <div
    class="step-3__container"
  >
    <v-progress-circular
      indeterminate
      size="48"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SupportStep4',

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    })
  }
}
</script>

<style lang="scss">
.step-3 {
  &__container {
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
