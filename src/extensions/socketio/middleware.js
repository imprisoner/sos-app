export const onConnection = (app) => async (socket, next) => {
  try {
    const { user } = socket.feathers

    const {
      data: [room]
    } = await app.service('rooms').find({
      [user.role]: user.id,
      isActive: true,
      query: {
        $sort: {
          createdAt: -1
        }
      }
    })

    socket.feathers.room = { ...room }
    next()
  } catch (err) {
    next(err)
  }
}
