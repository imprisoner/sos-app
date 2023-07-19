import { Unprocessable } from '@feathersjs/errors'

export const approveCreation = (context, next) => {
  if (context.hasUser) {
    throw new Unprocessable('User already exists')
  }
}