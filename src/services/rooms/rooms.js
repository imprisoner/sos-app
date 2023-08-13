// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  roomsDataValidator,
  roomsPatchValidator,
  roomsQueryValidator,
  roomsResolver,
  roomsExternalResolver,
  roomsDataResolver,
  roomsPatchResolver,
  roomsQueryResolver
} from './rooms.schema.js'
import { RoomsService, getOptions } from './rooms.class.js'
import { roomsPath, roomsMethods } from './rooms.shared.js'
import { setupTimeout } from '../../hooks/rooms/setup-timeout.js'
import { isRole } from '../../hooks/policies/is-role.js'

export * from './rooms.class.js'
export * from './rooms.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const rooms = (app) => {
  // Register our service on the Feathers application
  app.use(roomsPath, new RoomsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: roomsMethods,
    // You can add additional custom events to be sent to clients here
    events: ['join', 'timeout', 'close', 'typing', 'disconnect']
  })
  // Initialize hooks
  app.service(roomsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(roomsExternalResolver),
        schemaHooks.resolveResult(roomsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(roomsQueryValidator), schemaHooks.resolveQuery(roomsQueryResolver)],
      find: [isRole('volunteer')],
      get: [isRole('volunteer')],
      create: [isRole('patient'), schemaHooks.validateData(roomsDataValidator), schemaHooks.resolveData(roomsDataResolver)],
      patch: [schemaHooks.validateData(roomsPatchValidator), schemaHooks.resolveData(roomsPatchResolver), setupTimeout],
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
