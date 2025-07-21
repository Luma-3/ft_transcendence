import knex from 'knex';
import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const __dirname = import.meta.dirname;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/User.db',
    },
    migrations: {
      directory: path.resolve(__dirname, '../../migrations'),
      tableName: 'knex_schema_history',
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: '/app/data/User.db',
    },
    migrations: {
      directory: path.resolve(__dirname, '/app/migrations'),
      tableName: 'knex_schema_history',
    },
    useNullAsDefault: true
  },
};


const env = process.env.NODE_ENV ?? 'development';
export const knexInstance: Knex = knex(config[env]);

const destroyKnex = async () => {
  if (knexInstance) {
    await knexInstance.destroy();
  }
}

export { Knex, destroyKnex, config };
