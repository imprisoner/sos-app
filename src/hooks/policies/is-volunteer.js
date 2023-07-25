import { Unauthorized } from "../../errors/Unauthorized.js"

export const isVolunteer = async (context, next) => {
  const { user } = context.params

  if (user && user.role !== 'volunteer') {
    context.result = new Unauthorized('Your role is not allowed here')
  }

  return context
}