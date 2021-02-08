import AwsClient, { awsConfig } from '~/services/aws/AWSClient'

export default class S3Client {
  static async put ({ key, file }) {
    const s3Client = await AwsClient.s3()

    await s3Client.putObject({
      Bucket: awsConfig.s3bucket,
      Key: key,
      Body: file
    }).promise()
  }

  static async get ({ key }) {
    const s3Client = await AwsClient.s3()

    return s3Client.getObject({
      Bucket: awsConfig.s3bucket,
      Key: key
    }).promise()
  }

  static async getUrl ({ key }) {
    const s3Client = await AwsClient.s3()

    const url = await s3Client.getSignedUrl('getObject', {
      Bucket: awsConfig.s3bucket,
      Key: key
    })

    return url
  }
}