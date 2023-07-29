import Knex from 'knex'
import dotenv from 'dotenv'
import path from "node:path"
import nodemailer from 'nodemailer'
import { logger } from './src/logger.js'
import { app } from './src/app.js'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(
    { path: path.resolve(process.cwd(), '.env.development') }
  )
}

try {
  const isVerifiedSmtp = await nodemailer.createTransport(app.get('mailer')).verify()
  logger.info(`SMTP ok: ${isVerifiedSmtp}`)
} catch (err) {
  logger.error(err)
}

const databaseName = process.env.POSTGRES_DB

async function main() {
  let db = Knex(app.get('postgresql'))

  const { rows } = await db.raw('SELECT datname from pg_database')
  const isExists = rows.find(({ datname }) => datname === databaseName)

  if (!isExists) {
    await db.raw('CREATE DATABASE ??', databaseName)
  }
}

main().then(process.exit)