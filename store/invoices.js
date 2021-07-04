import AwsClient from '~/services/aws/AWSClient'

export const state = () => ({})

export const actions = {
  async invoicesLoad ({ commit, getters }, { year }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Items = [], Count = 0 } = await dbClient.query({
      TableName: 'money',
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': identityId,
        ':sk': `invoice#summary#${year}`
      },
      ScanIndexForward: false
    }).promise()

    return {
      invoices: Items,
      total: Count
    }
  },

  async invoicesStatsLoad (store, { year }) {
    const dbClient = await AwsClient.dynamoDb()
    const { identityId } = await AwsClient.credentials()

    const { Item } = await dbClient.get({
      TableName: 'money',
      Key: {
        pk: identityId,
        sk: `stats#invoice#summary#${year}`
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
