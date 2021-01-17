<template>
  <div>
    <title-anchored
      :anchor="article.slug"
    >
      <h2 class="display-1 mb-3">
        {{ article.title }}
      </h2>
    </title-anchored>

    <div
      class="article-slug__content"
      v-html="article.content"
    />
  </div>
</template>

<script>
import TitleAnchored from '~/components/general/TitleAnchored'

export default {
  name: 'ViewHelpSlug',

  components: {
    TitleAnchored
  },

  asyncData ({
    params,
    store,
    error
  }) {
    if (!params.slug) {
      return error(404, 'Article not found')
    }

    const article = store.getters['content/articleBySlug'](params.slug)

    return {
      article
    }
  },

  data () {
    return {
      article: {}
    }
  },

  head () {
    const { title } = this.article

    return {
      title
    }
  }
}
</script>

<style lang="scss">
.article-slug {
  &__content {
    margin-bottom: 200px;

    > p,
    > ul {
      margin-bottom: 0.6em;
    }

    > .embedded {
      margin: 2em 0;
      text-align: center;
    }
  }
}
</style>
