import { GeneralError } from '@feathersjs/errors';
import nodemailer from "nodemailer"

export const sendVerificationEmail = async (context, next) => {

  const creds = {
    yandex: {
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'continentalresident@yandex.ru',
        pass: 'ilqojdzfpijxqcij'
      }
    }
  }

  const transporter = nodemailer.createTransport(creds.yandex);

  const { emailVerificationToken } = context.result

  const subject = 'Verification token'
  const textMessage = 'Your verification token is: ' + emailVerificationToken

  const mailData = {
    sender: creds.yandex.auth.user,
    from: creds.yandex.auth.user,
    to: `${context.data.name} <${context.data.email}>`,
    subject,
    text: textMessage || ''
  };

  try {
    const result = await transporter.sendMail(mailData);
    if (result) {
      console.log('Verification email OK')
    }
  } catch (err) {
    throw new GeneralError('Something went wrong with emails, try again or contact support')
  }

}