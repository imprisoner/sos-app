import { logger } from '../../logger.js'
import { client } from '../../snsClient.js'
import { CreatePlatformEndpointCommand, PublishCommand } from '@aws-sdk/client-sns'
import {GeneralError} from '@feathersjs/errors'

export class AWS {
  async create(data, params) {
    return data
  }
  
  async createEndpoint(deviceToken, userId) {
    const input = {
      PlatformApplicationArn: process.env.AWS_PLATFORM_ARN, // required
      Token: deviceToken,
      CustomUserData: userId
    }
    const command = new CreatePlatformEndpointCommand(input)


    try {
      const response = await client.send(command)
      return response.EndpointArn
    } catch (err) {
      logger.error('Creating ARN endpoint error: \n' + err)
      throw new GeneralError(err)
    }
  }

  async publish(message, endpoint) {
    const input = {
      // PublishInput
      // TopicArn: "STRING_VALUE",
      TargetArn: endpoint,
      // PhoneNumber: "STRING_VALUE",
      Message: message // required
      // Subject: "STRING_VALUE",
      // MessageStructure: "STRING_VALUE",
      // MessageAttributes: { // MessageAttributeMap
      //   "<keys>": { // MessageAttributeValue
      //     DataType: "STRING_VALUE", // required
      //     StringValue: "STRING_VALUE",
      //     BinaryValue: "BLOB_VALUE",
      //   },
      // },
      // MessageDeduplicationId: "STRING_VALUE",
      // MessageGroupId: "STRING_VALUE",
    }
    const command = new PublishCommand(input)

    try {
      const response = await client.send(command)
      console.log(response)
      return response
    } catch (err) {
      logger.error('Publishing push notification error: \n' + err)
      throw new GeneralError(err)
    }
  }
}
