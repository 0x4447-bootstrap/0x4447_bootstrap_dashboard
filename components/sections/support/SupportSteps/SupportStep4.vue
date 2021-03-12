<template>
  <div
    class="step-3__container"
  >
    <progress-content />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProgressContent from '~/components/general/ProgressContent'

export default {
  name: 'SupportStep4',

  components: {
    ProgressContent
  },

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
