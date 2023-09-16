export const deviceTokensPath = 'device-tokens'

export const deviceTokensMethods = ['find', 'get', 'create', 'patch', 'remove']

export const deviceTokensClient = (client) => {
  const connection = client.get('connection')

  client.use(deviceTokensPath, connection.service(deviceTokensPath), {
    methods: deviceTokensMethods
  })
}
