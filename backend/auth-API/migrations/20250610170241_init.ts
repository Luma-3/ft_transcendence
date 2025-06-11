import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('token', (t) => {
    t.string('id').primary();
    t.uuid('user_id');
    t.string('family_id');
    t.text('device_id');
    t.string('ip_address');
    t.text('user_agent');
    t.timestamp('created_at');
    t.timestamp('expired_at');
    t.timestamp('last_used');
    t.boolean('is_active');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('token');
}

