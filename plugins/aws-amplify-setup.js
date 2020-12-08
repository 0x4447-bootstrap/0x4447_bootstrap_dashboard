import '@aws-amplify/ui-vue'
import { Amplify } from 'aws-amplify'

const awsConfig = {
  Auth: {
    identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
    region: process.env.AWS_COGNITO_REGION,
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_COGNITO_APP_CLIENT_ID
  },
  Storage: {
    bucket: process.env.AWS_USER_FILES_S3_BUCKET,
    region: process.env.AWS_USER_FILES_S3_REGION
  }
}

export default async function pluginAmplifyConfigure ({ store }) {
  Amplify.configure(awsConfig)

  if (process.env.NODE_ENV === 'development') {
    Amplify.Logger.LOG_LEVEL = 'DEBUG'
  }

  await store.dispatch('auth/checkUserAuthentication')
}
