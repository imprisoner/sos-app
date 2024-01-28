import { app } from '#src/app.js'


export const setupTimeout = (context, next) => {
  const roomsConfig = app.get('rooms')

  if(context.data.resultConditionRate >= 0) {
    return context
  }

  if (context?.data?.isActive === undefined) {
    const data = {
      room: {id: context.id}
    }
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(context.service.emit('timeout', data))
      }, roomsConfig.timeout)
    })
  }
}