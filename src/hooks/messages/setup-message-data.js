export const setupUserId = (context, next) => {
  const { params: { provider, headers, user } } = context

  if (provider !== 'socketio') {
    return context
  }

  const roomId = headers['x-room-id']
  const userId = user.id

  context.data = { userId, roomId, ...context.data }

  return context
}