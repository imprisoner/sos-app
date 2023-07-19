/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('users', (table) => {
    table.boolean('emailVerified').defaultTo(false)
    table.string('emailVerificationToken')
    table.string('avatar')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('users', (table) => {
    table.dropColumn('emailVerified')
    table.dropColumn('emailVerificationToken')
  })
};
