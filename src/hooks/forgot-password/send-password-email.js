import { GeneralError } from '@feathersjs/errors';
import { logger } from '../../logger.js';


export const sendPasswordEmail = async (context, next) => {
  const { password } = context.result

  const subject = 'New password generated'
  const textMessage = 'Your generated password is: ' + password

  const mailData = {
    to: `${context.data.name} <${context.data.email}>`,
    subject,
    text: textMessage || ''
  };

  context.app.service('mailer').create(mailData)
    .then((data) => JSON.stringify(data))
    .catch(logger.warn)
}