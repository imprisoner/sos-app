// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  sosDataValidator,
  sosPatchValidator,
  sosQueryValidator,
  sosResolver,
  sosExternalResolver,
  sosDataResolver,
  sosPatchResolver,
  sosQueryResolver
} from './sos.schema.js'
import { SosService, getOptions } from './sos.class.js'
import { sosPath, sosMethods } from './sos.shared.js'

export * from './sos.class.js'
export * from './sos.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const sos = (app) => {
  // Register our service on the Feathers application
  app.use(sosPath, new SosService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sosMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sosPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(sosExternalResolver),
        schemaHooks.resolveResult(sosResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(sosQueryValidator), schemaHooks.resolveQuery(sosQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(sosDataValidator), schemaHooks.resolveData(sosDataResolver)],
      patch: [schemaHooks.validateData(sosPatchValidator), schemaHooks.resolveData(sosPatchResolver)],
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
