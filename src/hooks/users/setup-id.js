import { v4 as uuid } from 'uuid'

export const setupId = async (context, next) => {
  context.data = { [context.service.id]: uuid(), ...context.data }
  return context
}