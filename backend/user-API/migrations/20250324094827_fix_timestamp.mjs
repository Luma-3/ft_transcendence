
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	const hasColumn = await knex.schema.hasColumn('users', 'created_at');
	if (!hasColumn) {
  		return knex.schema.alterTable('users', function(table) {
			table.dropColumn('created_at');
			table.timestamp('created_at');
	});
}};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	const hasColumn = await knex.schema.hasColumn('users', 'created_at');
	if (!hasColumn) {
  		return knex.schema.alterTable('users', function(table) {
			table.dropTimestamps();
	});
}};
