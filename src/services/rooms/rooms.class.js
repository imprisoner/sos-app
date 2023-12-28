import { KnexService } from '@feathersjs/knex'
import { logger } from '../../logger.js'
import { app } from '#src/app.js'
import { NotFound } from '@feathersjs/errors'
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RoomsService extends KnexService {
  async find(params) {
    if(params.query.audience) {
      return this.getRoomAudience(null, params)
    }

    return super.find(params)
  }

  async close(data, params) {

    const { user } = params
    const roomId = params.connection.room.id
    const room = await this.patch(roomId, { isActive: false }).catch(logger.warn)

    data = {
      id: user.id,
      name: user.name,
      room: {
        id: room.id,
        isActive: room.isActive
      }
    }

    this.emit('close', data)
    return data
  }

  async typing(data, params) {
    const {
      user,
      room
    } = params

    data = {
      id: user.id,
      name: user.name,
      room: {
        id: room.id
      }
    }
    this.emit('typing', data)
    return data
  }

  async rate(data, params) {
    const { room } = params

    data = {
      room: { id: room.id }
    }

    this.emit('rate', data)
    return data
  }

  async getRoomAudience(_, params) {
    const { user } = params

    const query = {
      [user.role]: user.id,
      isActive: true,
      $sort: {
        createdAt: -1
      }
    }

    const { data: [room] } = await this.find({ query })


    if (!room) {
      return { audience: [] }
    }

    const audience = app.channel(`rooms/${room.id}`).connections.map((connection) => {
      const { id, name, role, avatar } = connection.user

      return { id, name, role, avatar }
    })

    return { audience }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'rooms'
  }
}
