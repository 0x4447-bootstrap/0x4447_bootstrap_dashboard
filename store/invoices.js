import AwsClient from '~/services/aws/AWSClient'

const types = {
  INVOICE_PAGINATION_SET: 'INVOICE_PAGINATION_SET'
}

export const state = () => ({
  paginationKeys: {}
})

export const getters = {
  paginationKeys (state) {
    return state.paginationKeys
  }
}

export const actions = {
  async invoicesLoad ({ commit, getters }, { perPage, page }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const startKey = getters.paginationKeys[page]
    // Set pagination offset for query
    // using last loaded & stored document key

    const { Items = [], LastEvaluatedKey = null } = await dbClient.query({
      TableName: 'money',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': identityId,
        ':sk': 'invoice'
      },
      Limit: perPage,
      ScanIndexForward: false,
      ...(startKey && {
        ExclusiveStartKey: startKey
      })
    }).promise()

    if (LastEvaluatedKey) {
      // Store pagination key for the next page
      commit(types.INVOICE_PAGINATION_SET, {
        page: page + 1,
        key: LastEvaluatedKey
      })
    }

    return {
      invoices: Items
    }
  },

  async invoicesStatsLoad () {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Item } = await dbClient.get({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: 'stats#invoice#2021'
      }
    }).promise()

    return Item?.count || 0
  },

  async invoiceLoad (store, { invoiceId }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Items = [] } = await dbClient.query({
      TableName: 'money',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      FilterExpression: 'stripe_invoice_id = :stripe_invoice_id',
      ExpressionAttributeValues: {
        ':pk': identityId,
        ':sk': 'invoice',
        ':stripe_invoice_id': invoiceId
      },
      ScanIndexForward: false
    }).promise()

    if (Items.length === 0) {
      throw new Error('Invoice not found')
    }

    return Items[0]
  }
}

export const mutations = {
  [types.INVOICE_PAGINATION_SET] (state, { page, key }) {
    state.paginationKeys[page] = key
  }
}
