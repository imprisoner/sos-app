import { toolbox } from './toolbox/toolbox.js'

import { notifications } from './notifications/notifications.js'
import { deviceTokens } from './device-tokens/device-tokens.js'
import { messages } from './messages/messages.js'
import { rooms } from './rooms/rooms.js'
import { forgotPassword } from './forgot-password/forgotPassword.js'
import { user } from './users/users.js'
import { firebase } from './firebase/firebase.js'
import { upload } from './upload/upload.js'
import { appVersion } from './app-version/app-version.js'
import { accountProvider } from './account-providers/account-providers.js'

export const services = (app) => {
  app.configure(toolbox)

  // All services will be registered here
  app.configure(user)
  app.configure(forgotPassword)
  app.configure(messages)
  app.configure(rooms)
  app.configure(deviceTokens)
  app.configure(notifications)
  app.configure(firebase)
  app.configure(upload)
  app.configure(appVersion)
  app.configure(accountProvider)
}
