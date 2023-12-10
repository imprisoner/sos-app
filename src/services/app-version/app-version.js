import { KnexService } from '@feathersjs/knex'
import { Type } from "@feathersjs/typebox/lib/index.js";
import { logger } from '../../logger.js';
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class AppVersionService extends KnexService {
  async find(params) {
    if (params.query.latest) {
      return super.find({
        query: {
          $limit: 1,
          $sort: {
            createdAt: -1
          }
        }
      })
    }

    return super.find(params)
  }
}

const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'app-version'
  }
}

const AppVersionMethods = ['find', 'create']

export const appVersion = (app) => {
  app.use('app-version', new AppVersionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: AppVersionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
}