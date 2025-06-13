import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('people', (t) => {
    t.uuid('user_id').primary();
    t.string('username', 32).notNullable().unique();
    t.json("friends").defaultTo('{}');
    t.json("blocked").defaultTo('{}');
    t.json("pending").defaultTo('{}');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('people');
}

