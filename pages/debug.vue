<template>
  <v-layout column>
    <page-title
      :title="$routes.debug.title"
      anchor="debug"
    />

    <v-row>
      <a-column>
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
      </a-column>
    </v-row>

    <v-row>
      <a-column>
        <h3 class="text-h6 my-3 px-4">
          Versioning Test
        </h3>

        <v-card>
          <v-card-text>
            <v-row>
              <a-column>
                <v-simple-table
                  dense
                >
                  <template #default>
                    <tbody>
                      <tr
                        v-for="(value, key) in versioning"
                        :key="key"
                      >
                        <td>{{ key }}</td>
                        <td>
                          {{ value }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </a-column>
            </v-row>
          </v-card-text>
        </v-card>
      </a-column>
    </v-row>
  </v-layout>
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapActions } from 'vuex'
import LambdaClient from '~/services/aws/Lambda'

export default {
  name: 'ViewDebug',

  data () {
    return {
      currentCredentials: {},
      versioning: {}
    }
  },

  computed: {
    debugDetails () {
      return [
        {
          label: 'Cognito Identity ID',
          value: this.currentCredentials.identityId
        }
      ]
    }
  },

  async beforeMount () {
    this.currentCredentials = await Auth.currentCredentials()

    this.versioningTest()
  },

  methods: {
    ...mapActions({
      notificationShow: 'notifications/show'
    }),

    async versioningTest () {
      const version = this.$nuxt.context.isDev ? '$LATEST' : this.$config.VERSION_DASHBOARD_DEBUG_VERSION

      try {
        const { Payload } = await LambdaClient.invoke({
          functionName: 'dashboard_debug_version',
          version
        })

        this.versioning = JSON.parse(Payload)
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to retrieve debug version'
        })
      }
    }
  },

  head () {
    return {
      title: this.$routes.debug.title
    }
  }
}
</script>
