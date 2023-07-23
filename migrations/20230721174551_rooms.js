import { enums } from "../src/constants/databaseTypes.js"
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('rooms', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid()).unique()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.uuid('patient')
    table.foreign('patient').references('id').inTable('users')
    table.uuid('volunteer')
    table.foreign('volunteer').references('id').inTable('users')
    table.text('description')
    table.enu('affliction', enums.bodyParts, { useNative: true, enumName: 'bodyPart' })
    table.integer('conditionRate')
    table.boolean('isOpen').defaultTo(true)
    table.boolean('isActive').defaultTo(true)
    table.enu('resultAffliction', enums.bodyParts, { useNative: true, existingType: true, enumName: 'bodyPart' })
    table.integer('resultConditionRate')
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('rooms')
}
