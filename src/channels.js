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

    app.channel('anonymous').leave(connection)
    app.channel('authenticated').join(connection)

    if (connection) {
      const { data: [room] } = await app.service('rooms').find({
        query: {
          [connection.user.role]: connection.user.id,
          isActive: true,
          $sort: { createdAt: -1 }
        }
      })

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


  app.service('rooms').on('close', (data, context) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(app.channel(`rooms/${data.roomId}`).leave((connection) => connection))
      }, 100)
    })
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

  app.service('rooms').publish('typing', (data, context) => {
    return app.channel(`rooms/${data.roomId}`).filter((connection) => {
      return connection.user.id !== data.id
    })
  })

  app.service('rooms').publish('patched', (data, context) => {
    return app.channel(`rooms/${data.id}`)
  })

  app.service('messages').publish('created', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    console.log(data)
    return app.channel('authenticated')
  })
}
