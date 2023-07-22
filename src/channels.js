import '@feathersjs/transport-commons'
import { logger } from './logger.js'
import { app } from './app.js'
export const channels = () => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.js` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection) => {
    // console.log(connection)
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {
    if (!connection) {
      return
    }
    console.log('connected')
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)
    }

    const roomId = connection.headers['x-room-id']
    if (roomId) {
      app.service('rooms').get(roomId).then((room) => {

        
        if (room.isOpen) {
          console.log('got the room')
          app.channel(`rooms/${room.id}`).join(connection)
          console.log('joined')
        }

        if (app.channel(`rooms/${room.id}`).connections.length > 1) {
          app.service('rooms').patch(room.id, {
            // isOpen: false,
            status: 'active'
          })

          console.log(`room ${room.id} closed`)
        }
      })
    }
  })

  app.service('rooms').publish((data, context) => {
    return app.channel(`rooms/${data.roomId}`)
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    return app.channel('authenticated')
  })
}
