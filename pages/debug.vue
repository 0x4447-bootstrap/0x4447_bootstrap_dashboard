<template>
  <v-layout column>
    <h1 class="display-1 mb-3 px-4">
      {{ $routes.debug.title }}
    </h1>

    <v-card>
      <v-card-text>
        <v-row>
          <a-column
            sm="12"
            md="auto"
          >
            <v-simple-table
              dense
            >
              <template #default>
                <tbody>
                  <tr
                    v-for="(field, index) in debugDetails"
                    :key="index"
                  >
                    <td>{{ field.label }}</td>
                    <td>
                      {{ field.value }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </a-column>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ViewDebug',

  computed: {
    ...mapGetters({
      profile: 'user/profile'
    }),

    debugDetails () {
      return [
        {
          label: 'User Cognito ID',
          value: this.profile.id
        }
      ]
    }
  },

  head () {
    return {
      title: this.$routes.debug.title
    }
  }
}
</script>
