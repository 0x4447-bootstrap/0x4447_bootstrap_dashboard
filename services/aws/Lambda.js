import AwsClient from '~/services/aws/AWSClient'

export default class LambdaClient {
  static async invoke ({ functionName, version, payload }) {
    const lambdaClient = await AwsClient.lambda()

    const params = {
      FunctionName: functionName,
      ...(version && {
        Qualifier: `${version}`
      }),
      ...(payload && {
        Payload: JSON.stringify(payload)
      })
    }

    const response = await lambdaClient.invoke(params).promise()

    return response
  }
}
