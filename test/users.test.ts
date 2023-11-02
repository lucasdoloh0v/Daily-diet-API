import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('User tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able to create an user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Novo usuário',
        email: 'usuario@email.com',
        senha: 123456,
      })
      .expect(201)
  })
})
