export const setupRoomData = (context, next) => {
  const { params: { user } } = context

  context.data = {
    [user.role]: user.id,
    ...context.data
  }

  return context
}