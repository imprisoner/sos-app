import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DeviceTokensService extends KnexService {
  async create(data, params) {
    const { data: [entity] } = await this.find({userId: params.user.id})

    if (entity) {
      return entity.token === data.token ? entity : this.patch(entity.id, {...data})
    }

    return super.create()
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'device-tokens'
  }
}
