export const setupUserId = (context, next) => {
  const { params: { provider, headers, user } } = context

  if (provider !== 'socketio') {
    return context
  }

  const userId = user.id
  const userName = user.name

  context.data = { userId, userName, ...context.data }

  return context
}