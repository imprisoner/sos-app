import { Unauthorized } from "../../errors/Unauthorized.js"

export const isPatient = async (context, next) => {
  const { user } = context.params

  if (user && user.role !== 'patient') {
    context.result = new Unauthorized('Your role is not allowed here')
  }

  return context
}