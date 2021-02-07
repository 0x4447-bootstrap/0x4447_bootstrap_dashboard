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
import { Auth } from 'aws-amplify'
import LambdaClient from '~/services/aws/Lambda'

export default {
  name: 'ViewDebug',

  data () {
    return {
      currentCredentials: {}
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

    await LambdaClient.invoke({
      functionName: 'dashboard_debug_version',
      version: this.$config.VERSION_DASHBOARD_DEBUG_VERSION || '$LATEST'
    })
  },

  head () {
    return {
      title: this.$routes.debug.title
    }
  }
}
</script>
