export const toolboxPath = 'toolbox'

export const toolboxMethods = ['find']

export const toolboxClient = (client) => {
  const connection = client.get('connection')

  client.use(toolboxPath, connection.service(toolboxPath), {
    methods: toolboxMethods
  })
}
