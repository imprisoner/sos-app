import { Conflict } from '@feathersjs/errors'
export const validateNewPassword = (context, next) => {
  const { newPassword, confirmPassword } = context.data

  if (newPassword !== confirmPassword) {
    throw new Conflict('Password mismatch')
  }
}
