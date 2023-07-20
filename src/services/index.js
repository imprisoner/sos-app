import { sos } from './sos/sos.js'

import { forgotPassword } from './forgot-password/forgotPassword.js'
import { user } from './users/users.js'

export const services = (app) => {
  // app.configure(sos)

  // All services will be registered here
  app.configure(user)
  app.configure(forgotPassword)
}
