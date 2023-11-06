import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
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
        meal_date: '2023-11-01T08:10:00Z',
        in_diet: true,
      })
      .expect(201)
  })

  it('Should be able to update a meal', async () => {
    const login = await request(app.server).post('/users').send({
      name: 'Novo usuário',
      email: 'usuario@email.com',
      password: '123456',
    })

    const { token } = login.body

    const {
      body: { meal },
    } = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'pão com ovo',
        description: 'pão francês com ovo frito',
        meal_date: '2023-11-01T08:10:00Z',
        in_diet: true,
      })

    const response = await request(app.server)
      .put(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'pão francês com ovo frito e manteiga',
      })
      .expect(200)

    expect(response.body.meal).toEqual(
      expect.objectContaining({
        description: 'pão francês com ovo frito e manteiga',
      }),
    )
  })

  it('Should be able to delete a meal', async () => {
    const login = await request(app.server).post('/users').send({
      name: 'Novo usuário',
      email: 'usuario@email.com',
      password: '123456',
    })

    const { token } = login.body

    const {
      body: { meal },
    } = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'pão com ovo',
        description: 'pão francês com ovo frito',
        meal_date: '2023-11-01T08:10:00Z',
        in_diet: true,
      })

    await request(app.server)
      .delete(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(202)
  })
})
