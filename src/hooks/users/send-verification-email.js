import { GeneralError } from '@feathersjs/errors';

export const sendVerificationEmail = async (context, next) => {
  const { emailVerificationToken } = context.result

  const subject = 'Verification token'
  const textMessage = 'Your verification token is: ' + emailVerificationToken

  const mailData = {
    to: `${context.data.name} <${context.data.email}>`,
    subject,
    text: textMessage || ''
  };

  try {
    const result = await context.app.service('mailer').create(mailData);
    if (result) {
      console.log('Verification email OK')
    }
  } catch (err) {
    throw new GeneralError('Something went wrong with emails, try again or contact support')
  }

}