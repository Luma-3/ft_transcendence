
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('people', (t) => {
    t.uuid('user_id').primary();
    t.string('username', 32).notNullable().unique();
    t.json("friends").defaultTo('{}');
    t.json("blocked").defaultTo('{}');
    t.json("pending").defaultTo('{}');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('people');
};
