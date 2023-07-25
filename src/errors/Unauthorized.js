import { FeathersError } from '@feathersjs/errors'

export class Unauthorized extends FeathersError {
  constructor(message, data) {
    super(message, 'Unauthorized', 401, 'unauthorized', data)
  }
}