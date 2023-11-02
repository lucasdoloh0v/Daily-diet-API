import { afterAll, beforeAll, describe, test } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

describe('App test', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('App is running', async () => {
    await request(app.server).get('/').expect(404)
  })
})
