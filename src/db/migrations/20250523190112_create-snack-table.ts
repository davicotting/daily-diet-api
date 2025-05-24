import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('snacks', (table) => {
        table.string('name').notNullable();
        table.string('description').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.boolean('inDiet').notNullable()
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('snacks');
}

