import { logger } from '../../logger.js'
import { GeneralError } from '@feathersjs/errors'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

initializeApp({
  credentials: applicationDefault()
})

const service = getMessaging()


export class Firebase {
  async create(data, params) {
    return data
  }

  async publish({ payload, message, tokens }) {
    const response = await service.sendEachForMulticast({
      data: payload,
      notification: message,
      tokens
    })

    const failedTokens = []
    
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          logger.error(resp.error)
          failedTokens.push(tokens[idx])
        }
      })
      console.log('List of tokens that caused failures: ' + failedTokens)
    }
    
    return response
  }
}
