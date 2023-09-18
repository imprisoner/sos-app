/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).unique().primary()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.string('topic')
    table.string('messageId')
    table.uuid('recipientId')
    table.foreign('recipientId').references('id').inTable('users')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.dropTable('notifications')
}
