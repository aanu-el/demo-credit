import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.string('user_uuid').notNullable();
        table.string('account_number').notNullable();
        table.enu('txn_type', ['credit', 'debit']);
        table.string('account_balance').nullable();
        table.json('logs').nullable();
        table.timestamps(true, true);
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

