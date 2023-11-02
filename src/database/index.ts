import knex, { Knex } from 'knex'
import { env } from '../env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
  useNullAsDefault: true,
}

export const knexDB = knex(config)
