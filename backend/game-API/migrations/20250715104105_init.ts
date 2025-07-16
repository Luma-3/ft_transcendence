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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('matches');
}

// 
