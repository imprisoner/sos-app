// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver,
  userSchema,
  userDataSchema,
  userPatchSchema,
  userQuerySchema
} from './users.schema.js'
import { UserService, UserCustomService, getOptions } from './users.class.js'

import { checkEmailPresence } from '../../hooks/check-email-presence.js'
import { sendVerificationEmail } from '../../hooks/users/send-verification-email.js'
import { setupEmailVerification } from '../../hooks/users/setupEmailVerification.js'

import swagger from 'feathers-swagger';
import { validateVerificationToken } from '../../hooks/users/validate-verification-token.js'
import { approveCreation } from '../../hooks/users/approve-creation.js'
import { validateNewPassword } from '../../hooks/users/validate-new-password.js'

export const userPath = 'users'
export const userMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './users.class.js'
export * from './users.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app) => {
  

  // Register our service on the Feathers application
  app.use(userPath, new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      schemas: { userSchema, userDataSchema, userPatchSchema, userQuerySchema },
      docs: {
        securities: ['get', 'find', 'patch', 'remove'],
        operations: {
          remove: false,
          patch: false,
          get: false
        }
      },
    })
  })
  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')],

    },
    before: {
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver),
        checkEmailPresence,
        approveCreation,
        setupEmailVerification
      ],
      patch: [schemaHooks.validateData(userPatchValidator), schemaHooks.resolveData(userPatchResolver)],
      remove: [],
      
    },
    after: {
      all: [],
      create: [
        sendVerificationEmail
      ]
    },
    error: {
      all: []
    }
  })

  app.use(userPath + '/me', UserCustomService, {
    methods: ['changePassword', 'verifyEmail'],
    events: [],

    docs: swagger.createSwaggerServiceOptions({
      securities: ['changePassword', 'verifyEmail'],
      schemas: {}
    })
  })

  app.service(userPath + '/me').hooks({
    around: {
      verifyEmail: [authenticate('jwt')],
      changePassword: [authenticate('jwt')],
    },
    before: {
      changePassword: [validateNewPassword],
      verifyEmail: [validateVerificationToken]
    }
  })
}
