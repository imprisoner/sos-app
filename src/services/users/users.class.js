import { KnexService } from '@feathersjs/knex'
import swagger from "feathers-swagger";
import { app } from '../../app.js'
import { GeneralError } from '@feathersjs/errors';
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService extends KnexService {
  
}

export const UserCustomService = {
  create: async () => { },

  changePassword: swagger.customMethod('POST', '/change-password')(async (data, params) => {

    const { newPassword } = data

    await app.service('users').patch(params.user.id, { password: newPassword })
    return { message: 'Password change OK' }
  }),

  verifyEmail: swagger.customMethod('POST', '/verify-email')(async (data, params) => {
    const {id, emailVerified} = await app.service('users').patch(params.user.id, {
      emailVerified: true
    })

    return {id, emailVerified, message: "Email has been succesfully verified"}
  }),

  deleteAccount: swagger.customMethod('POST', '/delete')(async (_, params) => {
    const userId = params.user.id

    try {
      return await app.service('users').remove(params.users.id)
    } catch (e) {
      throw new GeneralError(e)
    }
  })
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'users'
  }
}
