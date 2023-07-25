import { Unprocessable } from '@feathersjs/errors'

export const setupVolunteer = async (context, next) => {
  if (context.data.resultConditionRate >= 0) {
    return context.data
  }

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