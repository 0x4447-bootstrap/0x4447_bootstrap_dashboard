import AwsClient from '~/services/aws/AWSClient'

export const state = () => ({})

export const getters = {}

export const actions = {
  async paymentDetailsLoad () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const response = await dbClient.query({
      TableName: 'default',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': identityId,
        ':sk': 'user#payment#'
      }
    }).promise()

    return response.Items[0]
  },

  async paymentDetailsCreate (context, paymentDetails) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const documentPayload = {
      pk: identityId,
      sk: `user#payment#${paymentDetails.last4}`,
      plan: paymentDetails.plan,
      card_token: paymentDetails.cardToken,
      card_id: paymentDetails.cardId,
      first_name: paymentDetails.firstName,
      last_name: paymentDetails.lastName,
      brand: paymentDetails.brand,
      exp_month: paymentDetails.expMonth,
      exp_year: paymentDetails.expYear,
      last4: paymentDetails.last4,
      address: {
        postal_code: paymentDetails.postalCode,
        country: paymentDetails.country
      },
      timestamp_created: Math.floor(Date.now() / 1000)
    }

    await dbClient.put({
      TableName: 'default',
      Item: documentPayload
    }).promise()
  },

  async paymentDetailsRemove (context, { last4 }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    await dbClient.delete({
      TableName: 'default',
      Key: {
        pk: identityId,
        sk: 'user#payment#' + last4
      }
    }).promise()
  }
}

export const mutations = {}
