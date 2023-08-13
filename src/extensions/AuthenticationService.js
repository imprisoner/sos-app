import jsonwebtoken from 'jsonwebtoken'
import { createDebug } from '@feathersjs/commons'
import { AuthenticationService } from '@feathersjs/authentication'

const debug = createDebug('@feathersjs/authentication/service')

class MyAuthService extends AuthenticationService {
  /**
   * Create and return a new JWT for a given authentication request.
   * Will trigger the `login` event.
   *
   * @param data The authentication request (should include `strategy` key)
   * @param params Service call parameters
   */
  async create(data, params) {
    const authStrategies = params.authStrategies || this.configuration.authStrategies

    if (!authStrategies.length) {
      throw new NotAuthenticated('No authentication strategies allowed for creating a JWT (`authStrategies`)')
    }

    const authResult = await this.authenticate(data, params, ...authStrategies)

    debug('Got authentication result', authResult)

    if (authResult.accessToken) {
      return authResult
    }

    if (data.rememberMe === true) {
      const patchedUser = await this.app.service('users').patch(authResult.user.id, {
        rememberMe: data.rememberMe
      })

      authResult.user.rememberMe = patchedUser.rememberMe
    }

    if (authResult.user.rememberMe) {
      params.jwtOptions = { expiresIn: '15d' }
    }

    const [payload, jwtOptions] = await Promise.all([
      this.getPayload(authResult, params),
      this.getTokenOptions(authResult, params)
    ])

    debug('Creating JWT with', payload, jwtOptions)

    const accessToken = await this.createAccessToken(payload, jwtOptions, params.secret)

    return {
      accessToken,
      ...authResult,
      authentication: {
        ...authResult.authentication,
        payload: jsonwebtoken.decode(accessToken)
      }
    }
  }
}

export { MyAuthService as AuthenticationService }
