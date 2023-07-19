import { forgotPassword } from './forgot-password/forgotPassword.js'
import { user } from './users/users.js'

export const services = (app) => {
  // All services will be registered here
  app.configure(user)
  app.configure(forgotPassword)
}
