import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("matches", (t) => {
    t.uuid("id").primary();
    t.timestamp("created_at");
    t.uuid("player_1").nullable();
    t.uuid("player_2");
    t.uuid("winner");
    t.integer("score_1");
    t.integer("score_2");
    t.string("type");
  });

  await knex.schema.createTable('pending', (t) => {
    t.increments('id').primary();
    t.uuid('user_id').references('id');
    t.uuid('pending_id').references('id');
    t.uuid('room_id');
    t.unique(['user_id', 'pending_id'], 'unique_pending_pair');
  })

  await knex.schema.createTable('kd_stats', (t) => {
    t.uuid('user_id').primary();
    t.integer('wins').defaultTo(0);
    t.integer('losses').defaultTo(0);
    t.integer('total_games').defaultTo(0);
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('matches');
  await knex.schema.dropTableIfExists('pending');
  await knex.schema.dropTableIfExists('kd_stats');
}

// 
