import AwsClient from '~/services/aws/AWSClient'

export default class LambdaClient {
  static async invoke ({ functionName, version }) {
    const lambdaClient = await AwsClient.lambda()

    const params = {
      FunctionName: functionName,
      ...(version && {
        Qualifier: `${version}`
      })
    }

    const response = await lambdaClient.invoke(params).promise()

    return response
  }
}
