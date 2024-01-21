// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { Unprocessable } from '@feathersjs/errors'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  messagesDataValidator,
  messagesPatchValidator,
  messagesQueryValidator,
  messagesResolver,
  messagesExternalResolver,
  messagesDataResolver,
  messagesPatchResolver,
  messagesQueryResolver
} from './messages.schema.js'
import { MessagesService, getOptions } from './messages.class.js'
import { messagesPath, messagesMethods } from './messages.shared.js'
import { isSockets } from '../../hooks/messages/is-sockets.js'
import { logger } from '../../logger.js'
import { isValidToolString } from '#src/helpers/toolbox.utils.js'

export * from './messages.class.js'
export * from './messages.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const messages = (app) => {
  // Register our service on the Feathers application
  app.use(messagesPath, new MessagesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: messagesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(messagesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(messagesExternalResolver),
        schemaHooks.resolveResult(messagesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(messagesQueryValidator),
        schemaHooks.resolveQuery(messagesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        (context) => {
          const { tool } = context.data

          if (tool && !isValidToolString(tool)) {
            throw new Unprocessable('Unprocessable entity', { tool })
          }
        },
        (context) => {
          const now = new Date()
          const userId = context.params.user.id
          const roomId = context.params.room.id
          const content = context.data.content

          logger.info(`
            ${now}\n
            userId: ${userId}\n
            roomId: ${roomId}\n
            text: ${content} 
          `)
        },
        isSockets,
        schemaHooks.validateData(messagesDataValidator),
        schemaHooks.resolveData(messagesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(messagesPatchValidator),
        schemaHooks.resolveData(messagesPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
