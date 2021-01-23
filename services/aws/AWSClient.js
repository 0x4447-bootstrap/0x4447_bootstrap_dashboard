import AWS from 'aws-sdk'
import { Auth } from 'aws-amplify'

export const awsConfig = {
  apiVersion: '2012-08-10',
  cognitoIdentityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
  cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  region: process.env.AWS_COGNITO_REGION
}

AWS.config.region = awsConfig.region

let credentials = null
let dynamoDbClient = null
let cognitoSync = null

export default class AwsClient {
  static async dynamoDb () {
    if (!dynamoDbClient) {
      await this.buildInstance()
    }

    return dynamoDbClient
  }

  static async cognitoSync () {
    if (!cognitoSync) {
      await this.buildInstance()
    }

    return cognitoSync
  }

  static async credentials () {
    if (!credentials) {
      await this.buildInstance()
    }

    return credentials
  }

  static async buildInstance () {
    const currentCredentials = await Auth.currentCredentials()
    const essentialCredentials = Auth.essentialCredentials(currentCredentials)

    credentials = essentialCredentials

    AWS.config.update({
      credentials: essentialCredentials,
      region: awsConfig.region
    })

    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: awsConfig.apiVersion
    })
    cognitoSync = new AWS.CognitoSync()
  }

  static destroyInstance () {
    credentials = null
    dynamoDbClient = null
    cognitoSync = null
  }
}
