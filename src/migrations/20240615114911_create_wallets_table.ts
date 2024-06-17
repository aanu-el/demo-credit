import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table) => {
        table.increments('id').primary();
        table.string('user_uuid').notNullable().references('user_uuid').inTable('users').onDelete('CASCADE');
        table.string('account_name').notNullable();
        table.string('account_number').notNullable();
        table.decimal('account_balance', 10, 2).notNullable();
        table.enu('status', ['active', 'deactivated']);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}

