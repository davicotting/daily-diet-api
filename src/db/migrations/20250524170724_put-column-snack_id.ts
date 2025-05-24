import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('snacks', (table) => {
        table.uuid('snack_id').primary();
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('snacks', (table) => {
        table.dropColumn('snack_id');
    })
}

