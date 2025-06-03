import dotenv from 'dotenv';
import path from 'path';

dotenv.config()

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/People.sqlite',

    },
    migrations: {
      directory: path.join(process.cwd(), 'migrations'),
      tableName: 'knex_schema_history',
      loadExtensions: ['.mjs', '.js']
    },
    seeds: {
      directory: path.join(process.cwd(), 'seeds', 'sandbox')
    },
    useNullAsDefault: true
  },
};

export default config;
