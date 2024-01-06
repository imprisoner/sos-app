// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  accountProviderDataValidator,
  accountProviderPatchValidator,
  accountProviderQueryValidator,
  accountProviderResolver,
  accountProviderExternalResolver,
  accountProviderDataResolver,
  accountProviderPatchResolver,
  accountProviderQueryResolver
} from './account-providers.schema.js'
import { AccountProviderService, getOptions } from './account-providers.class.js'

export const accountProviderPath = 'account-providers'
export const accountProviderMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './account-providers.class.js'
export * from './account-providers.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const accountProvider = (app) => {
  // Register our service on the Feathers application
  app.use(accountProviderPath, new AccountProviderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: accountProviderMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(accountProviderPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(accountProviderExternalResolver),
        schemaHooks.resolveResult(accountProviderResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(accountProviderQueryValidator),
        schemaHooks.resolveQuery(accountProviderQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(accountProviderDataValidator),
        schemaHooks.resolveData(accountProviderDataResolver)
      ],
      patch: [
        schemaHooks.validateData(accountProviderPatchValidator),
        schemaHooks.resolveData(accountProviderPatchResolver)
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
