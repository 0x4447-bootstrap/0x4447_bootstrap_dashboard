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
    const startKey = getters.paginationKeys[page]

    const { Items = [], LastEvaluatedKey = null, Count = 0 } = await dbClient.query({
      TableName: 'Payment',
      KeyConditionExpression: '#id = :id AND begins_with(#type, :type)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':id': identityId,
        ':type': 'user#invoice#'
      },
      Limit: perPage,
      ScanIndexForward: false,
      ...(startKey && {
        ExclusiveStartKey: startKey
      })
    })

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
  }
}

export const mutations = {
  [types.INVOICE_PAGINATION_SET] (state, { page, key }) {
    state.paginationKeys[page] = key
  }
}
