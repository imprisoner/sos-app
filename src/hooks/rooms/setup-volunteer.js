import { Unprocessable } from '@feathersjs/errors'

export const setupVolunteer = async (context, next) => {
  const { id, params: { user } } = context

  const { isOpen } = await context.service.get(id)

  if (!isOpen) {
    context.result = new Unprocessable('The room is not available')
  }

  if (user) {
    context.data = {
      [user.role]: user.id,
      ...context.data
    }
  }
  return context
}