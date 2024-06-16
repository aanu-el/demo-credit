import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table) => {
        table.increments('id').primary();
        table.string('user_uuid').notNullable().unique();
        table.string('account_name').notNullable();
        table.string('account_number').notNullable().unique();
        table.enu('status', ['active', 'deactivated']);
        table.string('account_balance').nullable();
        table.timestamps(true, true);
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}

