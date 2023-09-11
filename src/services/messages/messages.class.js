import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class MessagesService extends KnexService {}

export const getOptions = (app) => {
  return {
    // override default pagination
    paginate: {
      default: 5000,
      max: 5000
    },
    Model: app.get('postgresqlClient'),
    name: 'messages'
  }
}
