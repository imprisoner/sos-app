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
    table.uuid('patientId')
    table.foreign('patientId').references('id').inTable('users')
    table.text('description')
    table.enu('affliction', enums.bodyParts, { useNative: true, enumName: 'bodyPart' })
    table.integer('conditionRate')
    table.boolean('isOpen').defaultTo(true)
    table
      .enu('status', enums.roomStatus, { useNative: true, enumName: 'roomStatus' })
      .defaultTo(enums.roomStatus[0])
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('rooms')
}
