/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.createTable('device-tokens', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).unique().primary()
    table.string('token').unique()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.string('device')
    table.enu('platform', ['android', 'ios'])
    table.string('osVersion')
    table.uuid('userId')
    table.foreign('userId').references('id').inTable('users')
    table.enu('userRole', ['patient', 'volunteer'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.dropTable('device-tokens')
}
