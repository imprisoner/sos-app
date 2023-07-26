import { Unprocessable } from '@feathersjs/errors'

export const checkActiveRooms = (context, next) => {
  const query = context.service.find({ patient: context.user.id, isActive: true })

  if (query.total > 0) {
    context.result = query.data[data.length - 1]
  }

  return context
}