import Knex from 'knex'
import dotenv from 'dotenv'
import path from "node:path"

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(
    { path: path.resolve(process.cwd(), '.env.development') }
  )
}

const databaseName = process.env.POSTGRES_DB

const connection = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: databaseName,
}

async function main() {
  let db = Knex({
    client: 'pg',
    connection
  })

  const { rows } = await db.raw('SELECT datname from pg_database')
  const isExists = rows.find(({ datname }) => datname === databaseName)

  if (!isExists) {
    await db.raw('CREATE DATABASE ??', databaseName)
  }
}

main().then(process.exit)