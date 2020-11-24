import '@aws-amplify/ui-vue'
import { Amplify, Auth } from 'aws-amplify'

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

export default async function pluginAmplifyConfigure ({ redirect, store }) {
  Amplify.configure(awsConfig)

  if (process.env.NODE_ENV === 'development') {
    Amplify.Logger.LOG_LEVEL = 'DEBUG'
  }

  try {
    await store.dispatch('auth/checkUserAuthentication')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    redirect('/auth')
    await Auth.signOut()
  }
}
