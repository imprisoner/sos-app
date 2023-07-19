import shortid from 'shortid';

export const setupEmailVerification = async (context, next) => {
  console.log(context.data)
  const emailVerificationToken = shortid.generate()
  context.data = {
    emailVerificationToken,
    ...context.data
  }

  return context
}