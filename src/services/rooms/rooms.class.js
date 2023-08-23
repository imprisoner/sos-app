import { KnexService } from '@feathersjs/knex'
import { logger } from '../../logger.js'
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RoomsService extends KnexService {
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
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'rooms'
  }
}
