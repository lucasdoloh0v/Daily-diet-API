// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

type timestamp = string

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: timestamp
    }
  }
}
