import { Unprocessable, Conflict } from '@feathersjs/errors'

export const validateVerificationToken = async (context) => {
  const { user } = context.params
  const { emailVerificationToken } = context.data

  if (user.emailVerified) {
    throw new Unprocessable('Your e-mail already verified')
  }

  const isValid = user.emailVerificationToken === emailVerificationToken

  if (!isValid) {
    throw new Conflict('Wrong e-mail verification token')
  }

  return context
}