/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).unique().primary()
    table.string('email').unique()
    table.string('password')
    table.string('name')
    table.string('role')
    table.string('preferredLang')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('users')
}
