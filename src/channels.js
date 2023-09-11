import '@feathersjs/transport-commons'
import { logger } from './logger.js'
import { NotFound, GeneralError } from '@feathersjs/errors'

export const channels = (app) => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.js` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection) => {
    const { room, user } = connection

    app.channel(`rooms/${room.id}`).join(connection)

    const audience = app.channel(`rooms/${room.id}`).connections.map((connection) => {
      const { id, name, role, avatar } = connection.user

      return { id, name, role, avatar }
    })

    app.service('rooms').emit('join', {
      room: {
        id: room.id,
        description: room.description,
        affliction: room.affliction,
        conditionRate: room.conditionRate
      },
      joined: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      audience
    })
  })

  app.on('disconnect', async (connection) => {
    const { room, user } = connection

    app.service('rooms').emit('disconnect', {
      room: {
        id: room.id
      },
      disconnected: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    })

    const isRoomEmpty = app.channel(`rooms/${room.id}`).connections.length === 0

    if (isRoomEmpty) {
      await app.service('rooms').patch(room.id, { isActive: false }).catch(logger.warn)
    }
  })

  app.on('login', async (authResult, context) => {
    if (context.provider !== 'socketio') {
      return
    }
  })

  app.service('rooms').on('close', (data, context) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(app.channel(`rooms/${data.room.id}`).leave((connection) => connection))
      }, 100)
    })
  })

  app.service('rooms').publish('join', (data, context) => {
    return app.channel(`rooms/${data.room.id}`)
  })

  app.service('rooms').publish('timeout', (data, context) => {
    return app.channel(`rooms/${data.room.id}`)
  })

  app.service('rooms').publish('close', (data, context) => {
    return app.channel(`rooms/${data.room.id}`)
  })

  app.service('rooms').publish('typing', (data, context) => {
    return app.channel(`rooms/${data.room.id}`).filter((connection) => {
      return connection.user.id !== data.id
    })
  })

  app.service('rooms').publish('patched', (data, context) => {
    return app.channel(`rooms/${data.id}`).filter((connection) => {
      return connection.user.role === 'volunteer'
    })
  })

  app.service('rooms').publish('disconnect', (data, context) => {
    return app.channel(`rooms/${data.room.id}`).filter((connection) => {
      return connection.user.id !== data.id
    })
  })

  app.service('rooms').publish('rate', (data, context) => {
    return app.channel(`rooms/${data.room.id}`).filter((connection) => {
      return connection.user.role === 'volunteer'
    })
  })

  app.service('messages').publish('created', (data, context) => {
    logger.info('Connections now: ' + app.channel(`rooms/${data.roomId}`).connections.length)
    return app.channel(`rooms/${data.roomId}`)
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    logger.info('Publishing all eventss')
    return app.channel('authenticated')
  })
}
