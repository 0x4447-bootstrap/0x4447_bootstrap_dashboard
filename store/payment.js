import AwsClient from '~/services/aws/AWSClient'
import LambdaClient from '~/services/aws/Lambda'

export const state = () => ({
  plans: [
    {
      label: 'Monthly subscription',
      unit: 'month',
      id: process.env.STRIPE_PRICE_ID_MONTH,
      price: process.env.STRIPE_PRICE_MONTH_PRICE,
      priceLabel: `$${process.env.STRIPE_PRICE_MONTH_PRICE}/month`
    },
    {
      label: 'Yearly subscription',
      unit: 'year',
      id: process.env.STRIPE_PRICE_ID_YEAR,
      price: process.env.STRIPE_PRICE_YEAR_PRICE,
      priceLabel: `$${process.env.STRIPE_PRICE_YEAR_PRICE}/year`
    }
  ]
})

export const getters = {
  plans (state) {
    return state.plans
  }
}

export const actions = {
  async paymentDetailsLoad () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const response = await dbClient.query({
      TableName: 'money',
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
      TableName: 'money',
      Item: documentPayload
    }).promise()
  },

  async paymentDetailsRemove (context, { last4 }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    await dbClient.delete({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: 'user#payment#' + last4
      }
    }).promise()
  },

  async couponCheck (context, { coupon }) {
    const { Payload } = await LambdaClient.invoke({
      functionName: 'dashboard_profile_cupon_check',
      coupon
    })

    let payloadParsed

    try {
      payloadParsed = JSON.parse(Payload)
    } catch (err) {
      return {
        valid: false
      }
    }

    return {
      valid: payloadParsed?.is_valid
    }
  }
}

export const mutations = {}
