import { KnexService } from '@feathersjs/knex'
import path from 'node:path/posix'
import { app } from '../../app.js'
export class UploadService extends KnexService {
  async create(data, params) {
    const host = app.get('origins')[1] || ''
    const staticPath = app.get('staticPath') || '' 

    data = {
      path: path.join(host, staticPath, data.scope, params.file.filename)
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
