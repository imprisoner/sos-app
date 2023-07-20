export const sosPath = 'sos'

export const sosMethods = ['find', 'get', 'create', 'patch', 'remove']

export const sosClient = (client) => {
  const connection = client.get('connection')

  client.use(sosPath, connection.service(sosPath), {
    methods: sosMethods
  })
}
