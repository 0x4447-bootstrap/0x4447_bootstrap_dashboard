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

    // Set pagination offset for query
    // using last loaded & stored document key
    const year = (new Date().getFullYear() + 1) - page

    const { Items = [], LastEvaluatedKey = null, Count = 0 } = await dbClient.query({
      TableName: 'money',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': identityId,
        ':sk': `invoice#${year}`
      },
      Limit: perPage,
      ScanIndexForward: false
    }).promise()

    if (LastEvaluatedKey) {
      // Store pagination key for the next page
      commit(types.INVOICE_PAGINATION_SET, {
        page: page + 1,
        key: LastEvaluatedKey
      })
    }

    return {
      invoices: Items,
      total: Count
    }
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
