export const setupRoomData = (context, next) => {
  const { params: { user } } = context

  const userId = user.id

  context.data = { patient: userId, ...context.data }

  return context
}