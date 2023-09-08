import { NotFound, TooManyRequests } from '@feathersjs/errors'

export const onConnection = (app) => async (socket, next) => {
  try {
    const { user } = socket.feathers

    const query = {
      [user.role]: user.id,
      isActive: true,
      $sort: {
        createdAt: -1
      }
    }

    const {
      data: [room]
    } = await app.service('rooms').find({ query })

    socket.feathers.room = { ...room }

    if (!room) {
      throw new NotFound('Room for this user not found')
    }

    const alreadyHasThisConnection = app.channel(`rooms/${room.id}`).connections.some((connection) => {
      return connection.user.id === user.id
    })

    if (alreadyHasThisConnection) {
      throw new TooManyRequests('Duplicated socketio connection')
    }

    next()
  } catch (err) {
    next(err)
  }
}
