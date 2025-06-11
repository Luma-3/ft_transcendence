import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary();
    t.string("username", 32).notNullable().unique();
    t.string("email", 255).notNullable().unique();
    t.text("password").notNullable();
    t.timestamp("created_at");
  });

  await knex.schema.createTable('preferences', (t) => {
    t.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    t.enu('theme', ['dark', 'light']).defaultTo('dark');
    t.enu('lang', ['en', 'fr', 'es']).defaultTo('en');
    t.text('avatar');
    t.text('banner');
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('preferences');
  await knex.schema.dropTableIfExists('users');
}
