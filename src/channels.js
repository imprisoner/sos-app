import '@feathersjs/transport-commons'
import { logger } from './logger.js'
import { app } from './app.js'
import { NotFound } from '@feathersjs/errors'

export const channels = () => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.js` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection) => {
    app.channel('anonymous').join(connection)
  })

  app.on('login', async (authResult, { connection }) => {
    if (connection) {
      app.channel('anonymous').leave(connection)
      app.channel('authenticated').join(connection)

      const { data } = await app.service('rooms').find({
        query: {
          [connection.user.role]: connection.user.id,
          isActive: true
        }
      })
      const [room] = data

      if (!room) {
        throw new NotFound(`Active room not found.`)
      }

      app.channel(`rooms/${room.id}`).join(connection)
      app.service('rooms').emit('join', {
        roomId: room.id,
        user: {
          id: connection.user.id,
          name: connection.user.name,
          role: connection.user.role
        }
      })
    }
  })

  app.service('rooms').publish('join', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })
  
  app.service('rooms').publish('timeout', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  app.service('rooms').publish('close', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  app.service('rooms').publish('patched', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  app.service('messages').publish('created', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    return app.channel('authenticated')
  })
}
