import AWS from 'aws-sdk'
import { Auth } from 'aws-amplify'

export const awsConfig = {
  apiVersion: '2012-08-10',
  cognitoIdentityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
  cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  region: process.env.AWS_COGNITO_REGION,
  s3bucket: process.env.AWS_USER_FILES_S3_BUCKET
}

AWS.config.region = awsConfig.region

let credentials = null
let dynamoDbClient = null
let cognitoSync = null
let s3 = null
let lambda = null

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

  static async s3 () {
    if (!s3) {
      await this.buildInstance()
    }

    return s3
  }

  static async lambda () {
    if (!lambda) {
      await this.buildInstance()
    }

    return lambda
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
    s3 = new AWS.S3({
      apiVersion: awsConfig.apiVersion,
      region: awsConfig.region,
      bucket: awsConfig.s3bucket
    })
    lambda = new AWS.Lambda()
  }

  static destroyInstance () {
    credentials = null
    dynamoDbClient = null
    cognitoSync = null
    s3 = null
  }
}
