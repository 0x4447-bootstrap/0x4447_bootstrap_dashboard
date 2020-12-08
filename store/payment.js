// const types = {}
import AwsClient from '~/services/aws/AWSClient'

export const state = () => ({})

export const getters = {}

export const actions = {
  async paymentDetailsLoad () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const response = await dbClient.query({
      TableName: 'Payment',
      KeyConditionExpression: '#id = :id AND begins_with(#type, :type)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':id': identityId,
        ':type': 'user#payment#'
      }
    }).promise()

    return response.Items[0]
  },

  async paymentDetailsCreate (context, paymentDetails) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const documentPayload = {
      id: identityId,
      type: `user#payment#${paymentDetails.last4}`,
      card_token: paymentDetails.cardToken,
      card_id: paymentDetails.cardId,
      first_name: paymentDetails.firstName,
      last_name: paymentDetails.lastName,
      brand: paymentDetails.brand,
      exp_month: paymentDetails.expMonth,
      exp_year: paymentDetails.expYear,
      last4: paymentDetails.last4,
      address: {
        street_address: paymentDetails.streetAddress,
        city: paymentDetails.city,
        state: paymentDetails.state,
        postal_code: paymentDetails.postalCode,
        country: paymentDetails.country
      },
      timestamp_created: Math.floor(Date.now() / 1000)
    }

    await dbClient.put({
      TableName: 'Payment',
      Item: documentPayload
    }).promise()
  },

  async paymentDetailsRemove (context, { last4 }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    await dbClient.delete({
      TableName: 'Payment',
      Key: {
        id: identityId,
        type: 'user#payment#' + last4
      }
    }).promise()
  }
}

export const mutations = {}