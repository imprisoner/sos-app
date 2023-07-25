// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import { messagesClient } from './services/messages/messages.shared.js'

import { roomsClient } from './services/rooms/rooms.shared.js'

import { messageClient } from './services/messages/messages.shared'

import { userClient } from './services/users/users.shared'

/**
 * Returns a typed client for the feathersjs-swagger-tests-v5-koa app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(messageClient)

  client.configure(roomsClient)

  client.configure(messagesClient)

  return client
}
