import { enums } from "../src/constants/databaseTypes.js"

export async function up(knex) {
  await knex.schema.createTable('sos', (table) => {
    table.primary().uuid('id').defaultTo(knex.fn.uuid()).unique()
    table.dateTime('createdAt')
    table.foreign().uuid('patientId')
    table.text('description')
    table.enu('affliction', enums.bodyParts, { useNative: true, enumName: 'bodyPart' })
    table.integer('conditionRate')
    table.boolean('isOpen').defaultTo(true)
    table
      .enu('status', enums.sosStatus, { useNative: true, enumName: 'sosStatus' })
      .defaultTo(enums.sosStatus[0])
  })

}

export async function down(knex) {
  await knex.schema.dropTable('sos')
}
