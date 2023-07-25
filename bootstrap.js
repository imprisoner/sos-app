import Knex from 'knex'
import dotenv from 'dotenv'
import path from "node:path"
const filename = process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
dotenv.config(
  {
    path: path.resolve(process.cwd(), filename)
  }
)

const databaseName = process.env.DB_NAME

const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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