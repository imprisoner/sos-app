export const onConnection = (app) => async (socket, next) => {
  try {
    const { user } = socket.feathers

    const query = {
      [user.role]: user.id,
      isActive: true,
      $sort: {
        createdAt: -1
      }
    }

    const {
      data: [room]
    } = await app.service('rooms').find({ query })

    socket.feathers.room = { ...room }
    next()
  } catch (err) {
    next(err)
  }
}
