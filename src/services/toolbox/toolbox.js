// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  toolboxDataValidator,
  toolboxPatchValidator,
  toolboxQueryValidator,
  toolboxResolver,
  toolboxExternalResolver,
  toolboxDataResolver,
  toolboxPatchResolver,
  toolboxQueryResolver
} from './toolbox.schema.js'
import { ToolboxService, getOptions } from './toolbox.class.js'
import { toolboxPath, toolboxMethods } from './toolbox.shared.js'

export * from './toolbox.class.js'
export * from './toolbox.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const toolbox = (app) => {
  // Register our service on the Feathers application
  app.use(toolboxPath, new ToolboxService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: toolboxMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(toolboxPath).hooks({
    around: {
      all: [
        authenticate('jwt')
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(toolboxQueryValidator), schemaHooks.resolveQuery(toolboxQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(toolboxDataValidator), schemaHooks.resolveData(toolboxDataResolver)],
      patch: [schemaHooks.validateData(toolboxPatchValidator), schemaHooks.resolveData(toolboxPatchResolver)],
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
