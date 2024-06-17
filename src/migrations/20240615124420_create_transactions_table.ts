import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.string('user_uuid').notNullable().references('user_uuid').inTable('users').onDelete('CASCADE');
        table.string('txn_ref').notNullable();
        table.enu('txn_type', ['credit', 'debit']);
        table.decimal('account_balance', 10, 2).nullable();
        table.json('logs').nullable();
        table.timestamps(true, true);
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

