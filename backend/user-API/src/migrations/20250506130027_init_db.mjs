
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary();
    t.string('username', 32).notNullable().unique();
    t.string('email', 255).notNullable().unique();
    t.timestamp('created_at');
    t.text('password');
  });

  await knex.schema.createTable('preferences', (t) => {
    t.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    t.enu('theme', ['dark', 'light']).defaultTo('dark');
    t.enu('lang', ['en', 'fr', 'es']).defaultTo('en');
    t.text('avatar');
  })

  await knex.schema.createTable('sessions', (t) => {
    t.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('jti');
    t.timestamp('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('preferences');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('sessions');
};
