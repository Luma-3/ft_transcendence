import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary();
    t.uuid("google_id").unique();
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

  await knex.schema.createTable('friends', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.uuid('friend_id').references('id').inTable('users').onDelete('CASCADE');
    t.unique(['user_id', 'friend_id'], 'unique_friend_pair');
  })

  await knex.schema.createTable('blocked', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.uuid('blocked_id').references('id').inTable('users').onDelete('CASCADE');
    t.unique(['user_id', 'blocked_id'], 'unique_blocked_pair');
  })

  await knex.schema.createTable('pending', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.uuid('pending_id').references('id').inTable('users').onDelete('CASCADE');
    t.unique(['user_id', 'pending_id'], 'unique_pending_pair');
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('preferences');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('friends');
  await knex.schema.dropTableIfExists('blocked');
  await knex.schema.dropTableIfExists('pending');
}
