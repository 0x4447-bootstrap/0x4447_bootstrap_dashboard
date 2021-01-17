<template>
  <v-layout column>
    <h1 class="display-1 mb-3 px-4">
      {{ $routes.help.title }}
    </h1>

    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="3"
            class="py-0 mb-5 mb-md-0"
          >
            <v-list class="py-0">
              <v-list-item
                v-for="article in articles"
                :key="article.slug"
                :to="$routes.helpArticle(article.slug).route"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="article.title" />
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon>
                    mdi-chevron-right
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col class="py-0">
            <nuxt-child
              :key="$route.path"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ViewHelp',

  computed: {
    ...mapGetters({
      articles: 'content/articles'
    })
  },

  head () {
    return {
      title: this.$routes.help.title
    }
  }
}
</script>
