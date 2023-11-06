import { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'

import { knexDB } from '../database'

type RequestParamsWithId = FastifyRequest<{
  Params: { id: string }
}>

type Meals = {
  id: string
  name: string
  description: string
  meal_date: string
  in_diet: number
  user_id: string
}[]

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      return reply.status(401).send(error)
    }
  })

  app.get('/', async (request, reply) => {
    const userId = request.user.id

    const meals = await knexDB('meals').where({ user_id: userId })

    return reply.status(200).send({ meals })
  })

  app.get('/:id', async (request: RequestParamsWithId, reply) => {
    const userId = request.user.id
    const { id } = request.params

    const meal = await knexDB('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply.status(404).send({ message: 'meal not found' })
    }

    return reply.status(200).send({ meal })
  })

  app.get('/summary', async (request, reply) => {
    const userId = request.user.id

    const meals = await knexDB('meals').where({ user_id: userId })

    const getSequencyInDiet = (meals: Meals): number => {
      interface Sequency {
        sequency: number
        maxSequency: number
      }

      const sequencies: Sequency = meals.reduce<Sequency>(
        (previousValue: Sequency, currentValue) => {
          if (currentValue.in_diet) {
            previousValue.sequency += 1
            if (previousValue.sequency > previousValue.maxSequency) {
              previousValue.maxSequency = previousValue.sequency
            }
          } else {
            previousValue.sequency = 0
          }
          return previousValue
        },
        {
          sequency: 0,
          maxSequency: 0,
        } as Sequency,
      )

      return sequencies.maxSequency
    }

    const summary = {
      meals: meals.length,
      mealsInDiet: meals.filter((meal) => !!meal.in_diet === true).length,
      mealsOffDiet: meals.filter((meal) => !!meal.in_diet === false).length,
      higherSequenceInDiet: getSequencyInDiet(meals),
    }

    return reply.status(200).send({ summary })
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
        in_diet: inDiet ? 1 : 0,
        user_id: user.id,
      })
      .returning('*')

    return reply.status(201).send({ meal })
  })

  app.put('/:id', async (request: RequestParamsWithId, reply) => {
    const bodySchema = z.object({
      name: z
        .string({
          invalid_type_error: 'name must be a string',
        })
        .optional(),
      description: z
        .string({
          invalid_type_error: 'description must be a string',
        })
        .optional(),
      meal_date: z
        .string({
          invalid_type_error: 'meal_date must be a string',
        })
        .datetime()
        .optional(),
      in_diet: z
        .boolean({
          invalid_type_error: 'in_diet must be a string',
        })
        .optional(),
    })

    const body = bodySchema.safeParse(request.body)

    if (!body.success) {
      const messagesErrors = body.error.issues.map((issue) => issue.message)

      return reply.status(400).send({ messages: messagesErrors })
    }

    if (!Object.keys(body.data)) {
      return reply
        .status(400)
        .send({ message: 'you must send at least one property to update' })
    }

    const { id } = request.params

    const mealToUpdate = await knexDB('meals')
      .where({
        id,
        user_id: request.user.id,
      })
      .first()

    if (!mealToUpdate) {
      return reply.status(404).send({ message: 'meal not found' })
    }

    const inDiet = body.data.in_diet ? 1 : 0

    const mealUpdated = {
      ...mealToUpdate,
      ...body.data,
      in_diet: inDiet,
    }

    const [meal] = await knexDB('meals')
      .where({ id: mealUpdated.id })
      .update(mealUpdated)
      .returning('*')

    return reply.status(200).send({ meal })
  })

  app.delete('/:id', async (request: RequestParamsWithId, reply) => {
    const { id } = request.params
    const { id: userId } = request.user

    const meal = await knexDB('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply.status(404).send({ message: 'meal not found' })
    }

    await knexDB('meals').where({ id, user_id: userId }).delete()

    return reply.status(202).send()
  })
}
