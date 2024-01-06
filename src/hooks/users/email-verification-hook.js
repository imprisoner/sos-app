import shortid from 'shortid';
import { logger } from '#src/logger.js';

export const emailVerificationHook = async (context, next) => {
  const token = shortid.generate()

  const name = context.data.name
  const email = context.data.email
  const mailerService = context.app.service('mailer')

  const mailContent = {
    subject: '',
    message: ''
  }

  if (context.data.emailVerified) {
    // if strategy is 'google' set up random password
    context.data.password = token

    await next()

    mailContent.subject = 'Generated password'
    mailContent.message = 'Your current automatically generated password is: ' + token + '.'

  } else {
    // else setup email veirfication token
    context.data = {
      emailVerified: false,
      emailVerificationToken: token,
      ...context.data
    }

    await next()

    mailContent.subject = 'Verification token'
    mailContent.message = 'Your verification token is: ' + token

  }

  sendMail({name, email, ...mailContent, mailerService})
}

function sendMail({ name, email, subject, message, mailerService }) {
  const mailData = {
    to: `${name} <${email}>`,
    subject,
    text: message || ''
  }

  mailerService.create(mailData)
    .then((data) => logger.info(JSON.stringify(data))).catch(logger.warn)
}