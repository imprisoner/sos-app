if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

module.exports = {
  host: process.env.APP_HOST,
  port: Number(process.env.APP_PORT),
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
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: process.env.JWT_SECRET,
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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
}