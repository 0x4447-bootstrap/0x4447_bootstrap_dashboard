import AwsClient from '~/services/aws/AWSClient'
import LambdaClient from '~/services/aws/Lambda'

const types = {
  MODAL_SUBSCRIPTION_OPEN: 'MODAL_SUBSCRIPTION_OPEN'
}

export const state = () => ({
  plans: [
    {
      label: 'Yearly subscription',
      unit: 'year',
      id: process.env.STRIPE_PRICE_ID_YEAR,
      price: process.env.STRIPE_PRICE_YEAR_PRICE,
      priceLabel: `$${process.env.STRIPE_PRICE_YEAR_PRICE}/year`
    },
    {
      label: 'Monthly subscription',
      unit: 'month',
      id: process.env.STRIPE_PRICE_ID_MONTH,
      price: process.env.STRIPE_PRICE_MONTH_PRICE,
      priceLabel: `$${process.env.STRIPE_PRICE_MONTH_PRICE}/month`
    }
  ],

  isOpenModalSubscription: false
})

export const getters = {
  plans (state) {
    return state.plans
  },

  isOpenModalSubscription (state) {
    return state.isOpenModalSubscription
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
        ':sk': 'payment#'
      }
    }).promise()

    return response.Items[0]
  },

  async subscriptionDetailsLoad () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Item } = await dbClient.get({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: 'stripe#subscription#price'
      }
    }).promise()

    return Item
  },

  async paymentDetailsCreate ({ dispatch }, paymentDetails) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const subscriptionPayload = {
      pk: identityId,
      sk: `payment#${paymentDetails.last4}`,
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
      Item: subscriptionPayload
    }).promise()
  },

  async subscriptionPriceUpdate (context, { priceId }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const pricePayload = {
      pk: identityId,
      sk: 'stripe#subscription#price',
      price_id: priceId
    }

    await dbClient.put({
      TableName: 'money',
      Item: pricePayload
    }).promise()
  },

  async paymentDetailsRemove (context, { last4 }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    await dbClient.delete({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: 'payment#' + last4
      }
    }).promise()
  },

  async subscriptionCheck () {
    const { identityId } = await AwsClient.credentials()

    const { Payload } = await LambdaClient.invoke({
      functionName: 'dashboard_app_subscription_check',
      payload: {
        cognito_id: identityId
      }
    })

    let payloadParsed

    try {
      payloadParsed = JSON.parse(Payload)
    } catch (err) {}

    return {
      isSubscribed: !!payloadParsed?.is_subscribed
    }
  },

  async subscriptionCancel () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    await dbClient.delete({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: 'stripe#subscription#price'
      }
    }).promise()
  },

  async couponCheck (context, { coupon }) {
    const { Payload } = await LambdaClient.invoke({
      functionName: 'dashboard_profile_cupon_check',
      payload: {
        cupon_id: coupon
      }
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
  },

  setOpenModalSubscription ({ commit }, isOpen = false) {
    commit(types.MODAL_SUBSCRIPTION_OPEN, isOpen)
  }
}

export const mutations = {
  [types.MODAL_SUBSCRIPTION_OPEN] (state, isOpen = false) {
    state.isOpenModalSubscription = isOpen
  }
}
