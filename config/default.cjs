const path = require('path')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.development')
})

module.exports = {
  host: 'localhost',
  port: 3030,
  public: './public/',
  origins: [
    'http://localhost:3030'
  ],
  paginate: {
    default: 10,
    max: 50
  },
  postgresql: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: 'LtZF+LHH+vhPSFKeDMOd9yNEAI23beh0',
    authStrategies: [
      'jwt',
      'local'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: 'https://yourdomain.com',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: {
      usernameField: 'email',
      passwordField: 'password'
    }
  },
  mailer: {
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'continentalresident@yandex.ru',
      pass: 'ilqojdzfpijxqcij'
    }
  }
}