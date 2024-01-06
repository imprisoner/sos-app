const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.development')
  })
}

module.exports = {
  host: process.env.APP_HOST,
  port: Number(process.env.APP_PORT),
  public: './public/',
  uploadsDir: './public/uploads/',
  origins: [
    '*'
  ],
  paginate: {
    default: 10,
    max: 50
  },
  postgresql: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: process.env.JWT_SECRET,
    authStrategies: [
      'jwt',
      'local',
      'google'
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
    },
    oauth: {
      google: {
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        scope: ["email", "openid"]
      }
    }
  },
  mailer: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    someshit: 'ok'
  }
}