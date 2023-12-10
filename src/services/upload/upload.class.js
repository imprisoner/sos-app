import { KnexService } from '@feathersjs/knex'

export class UploadService extends KnexService {
  async create(data, params) {
    data = {
      path: data.scope + '/' + params.file.filename
    }
    return data
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'upload'
  }
}
