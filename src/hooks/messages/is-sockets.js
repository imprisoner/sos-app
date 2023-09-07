import { Unprocessable } from '@feathersjs/errors'

export const isSockets = (context, next) => {
  const {
    params: {
      provider,
      connection: { room }
    }
  } = context

  if (provider !== 'socketio' || !room.id) {
    throw new Unprocessable('Not allowed creating messages outside chat rooms')
  }

  context.data.roomId = room.id

  return context
}
