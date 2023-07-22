/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.uuid('userId')
    table.foreign('userId').references('id').inTable('users')
    table.uuid('roomId')
    table.foreign('roomId').references('id').inTable('rooms')
    table.foreign('text')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.string('content')
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('messages')
}
