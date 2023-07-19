import { NotFound } from '@feathersjs/errors'

export const approvePasswordCreation = (context, data) => {
  if (!context.hasEmail) {
    throw new NotFound('User is not registered')
  }
}