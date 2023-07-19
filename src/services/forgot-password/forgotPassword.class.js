import { app } from '../../app.js'

export class ForgotPasswordService {
  async create(data, params) {
    const { id, password } = data

    await app.service('users').patch(id, { password })

    return data
  }
}