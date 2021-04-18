import articles from '~/assets/content/articles.json'

export const state = () => ({
  articles
})

export const getters = {
  articles (state) {
    return state.articles
  },

  articleBySlug (state) {
    return articleSlug => state.articles.find(article => article.slug === articleSlug)
  }
}

export const actions = {}

export const mutations = {}
