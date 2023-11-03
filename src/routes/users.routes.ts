import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

import { knexDB } from '../database'
import { env } from '../env'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string({
        invalid_type_error: 'name must be a string',
        required_error: 'name is required',
      }),
      email: z
        .string({
          invalid_type_error: 'email must be a string',
          required_error: 'email is required',
        })
        .email('invalid email format'),
      password: z
        .string({
          invalid_type_error: 'password must be a string',
          required_error: 'password is required',
        })
        .min(6, 'min password length is 6')
        .max(10, 'max password length is 10'),
    })

    const body = bodySchema.safeParse(request.body)

    if (!body.success) {
      const messagesErrors = body.error.issues.map((issue) => issue.message)

      return reply.status(400).send({ messages: messagesErrors })
    }

    const { name, email, password } = body.data

    const userExists = await knexDB('users').where({ email }).first()

    if (userExists) {
      return reply.status(400).send({ message: 'this email is already in use' })
    }

    const hashedPassword = await hash(password.toString(), 8)
    const id = randomUUID()

    await knexDB('users').insert({
      id,
      name,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({}, env.AUTH_SECRET, {
      subject: id,
      expiresIn: '7d',
    })

    return reply.status(201).send({ token })
  })

  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      email: z
        .string({
          invalid_type_error: 'email must be a string',
          required_error: 'email is required',
        })
        .email('invalid email format'),
      password: z.string({
        invalid_type_error: 'password must be a string',
        required_error: 'password is required',
      }),
    })

    const body = bodySchema.safeParse(request.body)

    if (!body.success) {
      const messagesErrors = body.error.issues.map((issue) => issue.message)

      return reply.status(400).send({ messages: messagesErrors })
    }

    const { email, password } = body.data

    const user = await knexDB('users').where({ email }).first()

    if (!user) {
      return reply.status(401).send({ message: 'email or password is invalid' })
    }

    const isPasswordMatched = await compare(password, user.password)

    if (!isPasswordMatched) {
      return reply.status(401).send({ message: 'email or password is invalid' })
    }

    const token = jwt.sign({}, env.AUTH_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    })

    return reply.status(200).send({ token })
  })
}
