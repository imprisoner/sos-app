export const roomsPath = 'rooms'

export const roomsMethods = ['find', 'get', 'create', 'patch', 'remove', 'close', 'typing', 'rate']
export const roomsEvents = ['join', 'timeout', 'close', 'typing', 'disconnect', 'rate']
export const roomsClient = (client) => {
  const connection = client.get('connection')

  client.use(roomsPath, connection.service(roomsPath), {
    methods: roomsMethods
  })
}
