<template>
  <a
    :href="titleAnchor"
    :class="classLink"
    class="title-anchored__link"
  >
    <slot />
  </a>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TitleAnchored',

  props: {
    anchor: {
      type: String,
      default: ''
    }
  },

  computed: {
    ...mapState({
      route: 'route'
    }),

    titleAnchor () {
      return `#${this.anchor}`
    },

    classLink () {
      return [
        { 'title-anchored--active': this.route.hash === this.titleAnchor }
      ]
    }
  }
}
</script>

<style lang="scss">
.v-application a.title-anchored__link {
  color: inherit;
  text-decoration: none;
}

.title-anchored--active {
  animation: text-pulse 1s 3 linear;
}

@keyframes text-pulse {
  0% {
    color: inherit;
  }
  50% {
    color: #FDD835;
  }
  100% {
    color: inherit;
  }
}
</style>
