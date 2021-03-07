import AwsClient, { awsConfig } from '~/services/aws/AWSClient'

let session = null
let count = 0

export default class CognitoSyncClient {
  static async getRecords ({ datasetName }) {
    const cognitoClient = await AwsClient.cognitoSync()
    const credentials = await AwsClient.credentials()

    const { Records, SyncSessionToken, DatasetSyncCount } = await cognitoClient.listRecords({
      IdentityPoolId: awsConfig.cognitoIdentityPoolId,
      IdentityId: credentials.identityId,
      DatasetName: datasetName
    }).promise()

    session = SyncSessionToken
    count = DatasetSyncCount

    return Records
  }

  static async updateRecords (keyValues) {
    const cognitoClient = await AwsClient.cognitoSync()
    const credentials = await AwsClient.credentials()

    await cognitoClient.updateRecords({
      IdentityPoolId: awsConfig.cognitoIdentityPoolId,
      IdentityId: credentials.identityId,
      DatasetName: 'settings_dashboard',
      SyncSessionToken: session,
      RecordPatches: keyValues.map(({ key, value }) => ({
        SyncCount: count,
        Op: 'replace',
        Key: key,
        Value: JSON.stringify(value)
      }))
    }).promise()
  }

  static parseCognitoSyncRecords (records) {
    return records.reduce((result, record) => {
      try {
        result[record.Key] = JSON.parse(record.Value)
      } catch (err) {
        result[record.Key] = null
        // eslint-disable-next-line no-console
        console.error('Unable to parse settings', record)
      }

      return result
    }, {})
  }
}
