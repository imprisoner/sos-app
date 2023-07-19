import { GeneralError } from '@feathersjs/errors';

export const sendPasswordEmail = async (context, next) => {
  const { password } = context.result

  const subject = 'New password generated'
  const textMessage = 'Your generated password is: ' + password

  const mailData = {
    to: `${context.data.name} <${context.data.email}>`,
    subject,
    text: textMessage || ''
  };

  try {
    const result = await context.app.service('mailer').create(mailData)
    if (result) {
      console.log('Password email OK')
    }
  } catch (err) {
    throw new GeneralError('Something went wrong with emails, try again or contact support')
  }
}