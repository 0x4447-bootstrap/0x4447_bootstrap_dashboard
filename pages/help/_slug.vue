<template>
  <div>
    <title-anchored
      :anchor="article.slug"
    >
      <h2 class="display-1 mb-3">
        {{ article.title }}
      </h2>
    </title-anchored>

    <nuxt-content :document="article" />
  </div>
</template>

<script>
export default {
  name: 'ViewHelpSlug',

  async asyncData ({
    params,
    $content,
    error
  }) {
    if (!params.slug) {
      return error(404, 'Article not found')
    }

    const article = await $content('articles', params.slug).fetch()

    if (!article) {
      return error(404, 'Article not found')
    }

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
