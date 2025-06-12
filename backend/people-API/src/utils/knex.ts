import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export const knexConfig = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/People.sqlite',
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_schema_history',
      loadExtensions: ['.ts']
    },
    useNullAsDefault: true
  },
};

const environment = (process.env.NODE_ENV || 'development') as keyof typeof knexConfig;
const knex = Knex(knexConfig[environment]);

export default knex;

export const destroyKnex = async () => {
  if (knex) {
    await knex.destroy();
  }
}

