// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  deviceTokensDataValidator,
  deviceTokensPatchValidator,
  deviceTokensQueryValidator,
  deviceTokensResolver,
  deviceTokensExternalResolver,
  deviceTokensDataResolver,
  deviceTokensPatchResolver,
  deviceTokensQueryResolver
} from './device-tokens.schema.js'
import { DeviceTokensService, getOptions } from './device-tokens.class.js'
import { deviceTokensPath, deviceTokensMethods } from './device-tokens.shared.js'

export * from './device-tokens.class.js'
export * from './device-tokens.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceTokens = (app) => {
  // Register our service on the Feathers application
  app.use(deviceTokensPath, new DeviceTokensService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceTokensMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceTokensPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(deviceTokensExternalResolver),
        schemaHooks.resolveResult(deviceTokensResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(deviceTokensQueryValidator),
        schemaHooks.resolveQuery(deviceTokensQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(deviceTokensDataValidator),
        schemaHooks.resolveData(deviceTokensDataResolver)
      ],
      patch: [
        schemaHooks.validateData(deviceTokensPatchValidator),
        schemaHooks.resolveData(deviceTokensPatchResolver)
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
