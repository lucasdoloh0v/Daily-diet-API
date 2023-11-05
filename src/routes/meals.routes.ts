import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'

import { knexDB } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      return reply.status(401).send(error)
    }
  })

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string({
        invalid_type_error: 'name must be a string',
        required_error: 'name is required',
      }),
      description: z.string({
        invalid_type_error: 'description must be a string',
        required_error: 'description is required',
      }),
      meal_date: z
        .string({
          invalid_type_error: 'meal_date must be a string',
          required_error: 'meal_date is required',
        })
        .datetime(),
      in_diet: z.boolean({
        invalid_type_error: 'in_diet must be a string',
        required_error: 'in_diet is required',
      }),
    })

    const body = bodySchema.safeParse(request.body)

    if (!body.success) {
      const messagesErrors = body.error.issues.map((issue) => issue.message)

      return reply.status(400).send({ messages: messagesErrors })
    }

    const {
      name,
      description,
      meal_date: mealDate,
      in_diet: inDiet,
    } = body.data

    const id = randomUUID()
    const { user } = request

    const [meal] = await knexDB('meals')
      .insert({
        id,
        name,
        description,
        meal_date: mealDate,
        in_diet: inDiet,
        user_id: user.id,
      })
      .returning('*')

    return reply.status(201).send({ meal })
  })
}
