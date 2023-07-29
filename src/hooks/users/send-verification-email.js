import { GeneralError } from '@feathersjs/errors';
import { logger } from '../../logger.js';


export const sendVerificationEmail = async (context, next) => {
  const { emailVerificationToken } = context.result

  const subject = 'Verification token'
  const textMessage = 'Your verification token is: ' + emailVerificationToken

  const mailData = {
    to: `${context.data.name} <${context.data.email}>`,
    subject,
    text: textMessage || ''
  };

  context.app.service('mailer').create(mailData)
    .then(logger.info).catch(logger.warn)

  return context
}