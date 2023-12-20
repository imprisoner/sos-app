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
import { roomsPath, roomsMethods, roomsEvents } from './rooms.shared.js'
import { setupTimeout } from '../../hooks/rooms/setup-timeout.js'
import { isRole } from '../../hooks/policies/is-role.js'
import { logger } from '../../logger.js'
import { GeneralError } from '@feathersjs/errors'

export * from './rooms.class.js'
export * from './rooms.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const rooms = (app) => {
  // Register our service on the Feathers application
  app.use(roomsPath, new RoomsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: roomsMethods,
    // You can add additional custom events to be sent to clients here
    events: roomsEvents
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
      create: [
        isRole('patient'),
        schemaHooks.validateData(roomsDataValidator),
        schemaHooks.resolveData(roomsDataResolver)
      ],
      patch: [
        (context) => {
          if (context.params.provider !== 'socketio') {
            return
          }

          context.id = context.params.connection.room.id
        },
        schemaHooks.validateData(roomsPatchValidator),
        schemaHooks.resolveData(roomsPatchResolver),
        setupTimeout
      ],
      remove: []
    },
    after: {
      all: [],
      create: [
        async (context) => {
          const { data } = await context.app.service('device-tokens').find({
            query: {
              userRole: 'volunteer'
            }
          })

          const tokens = data.filter((item) => item.token).map((item) => item.token)

          if(!data.length) {
            return
          }

          const message = {
            title: 'SOS',
            body: `${context.params.user.name} needs your help!`
          }

          const payload = {
            patientId: context.params.user.id,
            patientName: context.params.user.name,
            roomId: context.result.id
          }

          await context.app
            .service('firebase')
            .publish({
              payload,
              message,
              tokens
            })
            .catch((err) => {
              logger.error(err)
              throw new GeneralError(err)
            })
        }
      ]
    },
    error: {
      all: []
    }
  })
}
