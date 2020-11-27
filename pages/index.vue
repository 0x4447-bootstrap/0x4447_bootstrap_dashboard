<template>
  <div class="container">
    Welcome!
  </div>
</template>

<script>
export default {
  name: 'ViewDashboard',

  head () {
    return {
      title: this.$routes.dashboard.title
    }
  }
}
</script>
