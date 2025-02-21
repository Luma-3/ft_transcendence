
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable('users', function (table) {
	table.increments('id');
	table.string('username', 32).notNullable().unique();
	table.string('email', 255).notNullable().unique();
	table.timestamp('created_at').defaultTo(knex.fn.now);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists('users')
};
