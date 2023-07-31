import { Unprocessable } from '@feathersjs/errors'

export const isSockets = (context, next) => {
  const { params: { provider } } = context
  console.log(provider)
  if (provider !== 'socketio') {
    throw new Unprocessable('Not allowed creating messages outside chat rooms')
  }

  return context
}