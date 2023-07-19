import { app } from '../../app.js'

export class ForgotPasswordService {
  async create(data, params) {
    const { userId, password } = data

    await app.service('users').patch(userId, { password })

    return data
  }
}