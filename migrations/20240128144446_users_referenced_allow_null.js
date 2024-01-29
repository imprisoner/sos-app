/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.raw(`
    ALTER TABLE "account-providers"
    DROP CONSTRAINT account_providers_userid_foreign;

    ALTER TABLE "device-tokens"
    DROP CONSTRAINT device_tokens_userid_foreign;

    ALTER TABLE "messages"
    DROP CONSTRAINT messages_userid_foreign;

    ALTER TABLE "notifications"
    DROP CONSTRAINT notifications_recipientid_foreign;

    ALTER TABLE "rooms"
    DROP CONSTRAINT rooms_patient_foreign;
    
    ALTER TABLE "rooms"
    DROP CONSTRAINT rooms_volunteer_foreign;
  `)

  await knex.schema.alterTable('rooms', allowSetNullOnDelete(['patient', 'volunteer']))
  await knex.schema.alterTable('account-providers', allowSetNullOnDelete(['userId']))
  await knex.schema.alterTable('messages', allowSetNullOnDelete(['userId']))
  await knex.schema.alterTable('notifications', allowSetNullOnDelete(['recipientId']))
  await knex.schema.alterTable('device-tokens', (table) => {
      table.uuid('userId')
        .alter({ alterType: false })
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.raw(`
    ALTER TABLE "account-providers"
    DROP CONSTRAINT account_providers_userid_foreign;

    ALTER TABLE "device-tokens"
    DROP CONSTRAINT device_tokens_userid_foreign;

    ALTER TABLE "messages"
    DROP CONSTRAINT messages_userid_foreign;

    ALTER TABLE "notifications"
    DROP CONSTRAINT notifications_recipientid_foreign;

    ALTER TABLE "rooms"
    DROP CONSTRAINT rooms_patient_foreign;
    
    ALTER TABLE "rooms"
    DROP CONSTRAINT rooms_volunteer_foreign;
  `)

  await knex.schema.alterTable('rooms', undoAllowSetNullOnDelete(['patient', 'volunteer']))
  await knex.schema.alterTable('account-providers', undoAllowSetNullOnDelete(['userId']))
  await knex.schema.alterTable('device-tokens', undoAllowSetNullOnDelete(['userId']))
  await knex.schema.alterTable('messages', undoAllowSetNullOnDelete(['userId']))
  await knex.schema.alterTable('notifications', undoAllowSetNullOnDelete(['recipientId']))
}


function allowSetNullOnDelete(columns = []) {
  return (table) => {
    columns.forEach((col) => {
      table.uuid(col)
        .alter({ alterType: false })
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('SET NULL')
    })
  }
}

function undoAllowSetNullOnDelete(columns = []) {
  return (table) => {
    columns.forEach((col) => {
      table.uuid(col)
        .alter({ alterType: false })
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('NO ACTION')
    })
  }
}