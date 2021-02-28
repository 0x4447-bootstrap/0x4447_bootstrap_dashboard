import { v4 as uuid } from 'uuid'
import s3Client from '~/services/aws/S3'
import AwsClient from '~/services/aws/AWSClient'

export const actions = {
  async ticketCreate ({ rootGetters }, payload) {
    const {
      email: emailReplyTo,
      givenName
    } = rootGetters['user/profile']
    const userId = (await AwsClient.credentials()).identityId
    const domainName = window?.location.host
    const ticketKey = `${userId}/${uuid()}.json`

    const ticket = {
      subject: `Support request from: ${domainName}`,
      body: payload.message,
      emails: {
        to: {
          name: 'Support manager',
          email: 'name@example.com'
        },
        reply_to: {
          name: givenName || '-',
          email: emailReplyTo
        }
      }
      // attachments: [
      // {
      //   filename: 'OPTIONAL.pdf',
      //   content: 'A_BUFFER.toString(\'base64\')',
      //   encoding: 'base64'
      // }
      // ]
    }

    await s3Client.put({
      ACL: 'bucket-owner-full-control',
      key: ticketKey,
      body: JSON.stringify(ticket),
      params: {
        Bucket: '0x4447-support-web-us-east-1-messages',
        ContentType: 'application/json; charset=utf-8'
      }
    })
  }
}
