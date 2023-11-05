import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './routes/users.routes'
import { mealsRoutes } from './routes/meals.routes'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.AUTH_SECRET,
})
app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })
