import shortid from 'shortid';

export const createTemporaryPassword = (context, next) => {
  context.data.password = shortid.generate()
  return context
}