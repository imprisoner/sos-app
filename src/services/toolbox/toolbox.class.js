import { KnexService } from '@feathersjs/knex'
import { TOOLBOX } from '#constants/toolbox.types.js'
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ToolboxService extends KnexService {
  async find(params) {
    return TOOLBOX
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'toolbox'
  }
}
