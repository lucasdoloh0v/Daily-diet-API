import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcryptjs'

import { knexDB } from '../database'

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

    await knexDB('users').insert({ name, email, password: hashedPassword })

    return reply.status(201).send()
  })
}
