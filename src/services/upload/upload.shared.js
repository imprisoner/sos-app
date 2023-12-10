export const uploadPath = 'upload'

export const uploadMethods = ['find', 'get', 'create', 'patch', 'remove']

export const uploadClient = (client) => {
  const connection = client.get('connection')

  client.use(uploadPath, connection.service(uploadPath), {
    methods: uploadMethods
  })
}
