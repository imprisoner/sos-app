import { KnexService } from '@feathersjs/knex'

export class UploadService extends KnexService {
  async create(data, params) {
    // TODO
    const host = 'https://stage.sos.luden-labs.com'
    const staticPath = '/static'

    data = {
      path: host + staticPath + '/' + data.scope + '/' + params.file.filename
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
