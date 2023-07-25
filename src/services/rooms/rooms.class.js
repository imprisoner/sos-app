import { KnexService } from '@feathersjs/knex'
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RoomsService extends KnexService {
  async timeout(data, params) {
    this.emit('timeout', data)
    return data
  }

  async close(data, params) {
    this.emit('close', data)
    const { userId, roomId } = data
    await this.patch(roomId, { isActive: false })
    return {msg: 'ok'}
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'rooms'
  }
}
