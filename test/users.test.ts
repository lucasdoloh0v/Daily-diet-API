import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
} from 'vitest'
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
        password: '123456',
      })
      .expect(201)
  })

  describe('Should not be able to create an user with invalid informations', async () => {
    test('invalid name', async () => {
      const response = await request(app.server)
        .post('/users')
        .send({
          name: 4,
          email: 'test@email.com',
          password: '123456',
        })
        .expect(400)

      expect(JSON.parse(response.text)).toEqual({
        messages: ['name must be a string'],
      })
    })

    test('invalid email', async () => {
      const response = await request(app.server)
        .post('/users')
        .send({
          name: 'test user',
          email: 'test',
          password: '123456',
        })
        .expect(400)

      expect(JSON.parse(response.text)).toEqual({
        messages: ['invalid email format'],
      })
    })

    test('invalid password', async () => {
      const response = await request(app.server)
        .post('/users')
        .send({
          name: 'test user',
          email: 'test@email.com',
          password: '123',
        })
        .expect(400)

      expect(JSON.parse(response.text)).toEqual({
        messages: ['min password length is 6'],
      })
    })

    test('email in use', async () => {
      await request(app.server).post('/users').send({
        name: 'test user',
        email: 'test@email.com',
        password: '123456',
      })

      const response = await request(app.server)
        .post('/users')
        .send({
          name: 'test user',
          email: 'test@email.com',
          password: '123456',
        })
        .expect(400)

      expect(JSON.parse(response.text)).toEqual({
        message: 'this email is already in use',
      })
    })

    test('register user return a token', async () => {
      const response = await request(app.server).post('/users').send({
        name: 'test user',
        email: 'test@email.com',
        password: '123456',
      })

      expect(response.body).toHaveProperty('token')
    })

    test('login return a token', async () => {
      await request(app.server).post('/users').send({
        name: 'test user',
        email: 'test@email.com',
        password: '123456',
      })

      const response = await request(app.server).post('/users/login').send({
        email: 'test@email.com',
        password: '123456',
      })

      expect(response.body).toHaveProperty('token')
    })
  })
})
