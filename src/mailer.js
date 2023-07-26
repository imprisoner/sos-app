import mailerService from 'feathers-mailer'

export const mailer = (app) => {
  const config = app.get('mailer')
  app.use('mailer', mailerService(config, {from: config.auth.user}))
}