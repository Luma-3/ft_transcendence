
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('users', function (table) {
    table.string('lang', 2);
    table.string('pp_url');
    table.string('theme', 5);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('lang');
    table.dropColumn('pp_url');
    table.dropColumn('theme');
  })
};
