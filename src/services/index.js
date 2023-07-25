import { messages } from './messages/messages.js'

import { rooms } from './rooms/rooms.js'

import { forgotPassword } from './forgot-password/forgotPassword.js'
import { user } from './users/users.js'

export const services = (app) => {
  app.configure(messages)

  app.configure(rooms)


  // All services will be registered here
  app.configure(user)
  app.configure(forgotPassword)
}
