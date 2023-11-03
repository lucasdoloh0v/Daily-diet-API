import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('Meals routes tests', async () => {
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

  it('Should be able to create a meal', async () => {
    const login = await request(app.server).post('/users').send({
      name: 'Novo usuário',
      email: 'usuario@email.com',
      password: '123456',
    })

    const { token } = login.body

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'pão com ovo',
        description: 'pão francês com ovo frito',
        date: '2023-11-01 08:10:00',
        onDiet: true,
      })
      .expect(201)
  })
})
