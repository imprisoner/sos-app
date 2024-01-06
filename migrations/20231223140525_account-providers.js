/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.createTable('account-providers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).unique().primary()
    table.uuid('userId').unique()
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE')
    table.string('provider')
    table.string('profileId').unique()
    table.string('email').unique()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.dropTable('account-providers')
}
