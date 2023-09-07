import '@feathersjs/transport-commons'
import { logger } from './logger.js'
import { NotFound, GeneralError } from '@feathersjs/errors'

export const channels = (app) => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.js` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection) => {
    app.channel('anonymous').join(connection)
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
  })

  app.on('login', async (authResult, { connection }) => {
    if (!connection) {
      return
    }

    app.channel('anonymous').leave(connection)
    app.channel('authenticated').join(connection)

    const joinedUser = connection.user
    const query = {
      [joinedUser.role]: joinedUser.id,
      isActive: true,
      $sort: { createdAt: -1 }
    }

    const {
      data: [room]
    } = await app.service('rooms').find({ query })

    if (!room) {
      app.channel(`rooms/${connection.user.id}`).join(connection)
      app.service('rooms').emit('disconnect', {
        room: {
          id: joinedUser.id
        },
        disconnected: {
          id: joinedUser.id,
          name: joinedUser.name,
          role: joinedUser.role,
          avatar: joinedUser.avatar
        }
      })
      return
    }

    const audience = app.channel(`rooms/${room.id}`).connections.map((connection) => {
      const { id, name, role, avatar } = connection.user

      return { id, name, role, avatar }
    })

    //
    const alreadyHasThisConnection = audience.some((user) => {
      return user.id === joinedUser.id
    })

    if (alreadyHasThisConnection) {
      logger.warn('Chat already has this connection')
      logger.info('Audience: \n' + JSON.stringify(audience))
      logger.info('Joined user: \n' + JSON.stringify(joinedUser))

      throw new GeneralError('Chat already has this connection. See logs for details.')
    }
    //
    app.channel(`rooms/${room.id}`).join(connection)

    app.service('rooms').emit('join', {
      room: {
        id: room.id,
        description: room.description,
        affliction: room.affliction,
        conditionRate: room.conditionRate
      },
      joined: {
        id: joinedUser.id,
        name: joinedUser.name,
        role: joinedUser.role,
        avatar: joinedUser.avatar
      },
      audience
    })
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
    return app.channel(`rooms/${data.room.id}`)
  })

  app.service('messages').publish('created', (data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    logger.info('Publishing all eventss')
    return app.channel('authenticated')
  })
}
