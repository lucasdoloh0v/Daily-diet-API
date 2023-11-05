import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('meal_date').notNullable()
    table.boolean('in_diet').notNullable()
    table.uuid('user_id').references('id').inTable('users').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
