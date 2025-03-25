
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.alterTable('users', function(table) {
		table.dropColumn('email');
	})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	return knex.schema.alterTable('users', function(table) {
		table.string('email');
	})
};
