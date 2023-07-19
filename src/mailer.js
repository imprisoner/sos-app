import mailerService from 'feathers-mailer'
// import nodemailer from 'nodemailer'

export const mailer = (app) => {
  const config = app.get('mailer')

  app.use('mailer', mailerService(config, {from: config.auth.user}))
}