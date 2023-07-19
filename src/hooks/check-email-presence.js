
import { app } from '../app.js'

export const checkEmailPresence = async (context, next) => {
  const { email } = context.data
  const user = await app.service('users').find(({
    query: {
      email
    }
  }))
  context.hasEmail = user.total > 0
  
  if (context.hasEmail) {
    context.data.userId = user.data[0].id
  }
  return context
}