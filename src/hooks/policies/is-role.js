import { Unauthorized } from "../../errors/Unauthorized.js"

export const isRole = (role) => async (context, next) => {
  const { user } = context.params

  if (user && user.role !== role) {
    throw new Unauthorized('Your role is not allowed here')
  }

  return context
}