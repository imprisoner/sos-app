export const roomsPath = 'rooms'

export const roomsMethods = ['find', 'get', 'create', 'patch', 'remove', 'close', 'typing']
export const roomsEvents = ['join', 'timeout', 'close', 'typing', 'disconnect']
export const roomsClient = (client) => {
  const connection = client.get('connection')

  client.use(roomsPath, connection.service(roomsPath), {
    methods: roomsMethods
  })
}
