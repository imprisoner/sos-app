// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService } from './extensions/AuthenticationService.js'
import { JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { hooks as schemaHooks, resolve } from '@feathersjs/schema'
import { GoogleStrategy } from './extensions/custom-strategies/google.js'
import { oauth } from '@feathersjs/authentication-oauth'

export const authentication = (app) => {
  const authentication = new AuthenticationService(app)

  authentication.docs = {
    idNames: {
      remove: 'accessToken'
    },
    idType: 'string',
    securities: ['remove', 'removeMulti'],
    multi: ['remove'],
    schemas: {
      authRequest: {
        type: 'object',
        properties: {
          strategy: { type: 'string', enum: ['local', 'github'] },
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      authResult: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          authentication: {
            type: 'object',
            properties: {
              strategy: { type: 'string' },
              payload: {
                type: 'object',
                properties: {}
              }
            }
          },
          user: { $ref: '#/components/schemas/User' }
        }
      }
    },
    refs: {
      createRequest: 'authRequest',
      createResponse: 'authResult',
      removeResponse: 'authResult',
      removeMultiResponse: 'authResult'
    },
    operations: {
      remove: {
        description: 'Logout the currently logged in user',
        'parameters[0].description': 'accessToken of the currently logged in user'
      },
      removeMulti: {
        description: 'Logout the currently logged in user',
        parameters: []
      }
    }
  }

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('google', new GoogleStrategy())

  app.use('authentication', authentication)
  app.configure(oauth({ linkStrategy: "jwt" }))
  
  app.service('authentication').hooks({
    around: {
      // prevent showing authentication payload in response
      create: [
        schemaHooks.resolveExternal(
          resolve({
            authentication: async () => undefined
          })
        )
      ]
    },
    before: {
      // resolve local strategy by default
      create: [
        schemaHooks.resolveData(
          resolve({
            strategy: async (value) => value || 'local'
          })
        )
      ]
    }
  })
}
