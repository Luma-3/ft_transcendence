import formatter from '@transcenduck/formatter'
import knex from '#transcenduck/plugins/knex'
import swagger from '#transcenduck/plugins/swagger'
import knex_config from './knex.config'

export const config_dev = {
  logger: true,
};

export async function registerPlugin(fastify) {
  await fastify.register(formatter);

  await fastify.register(knex, knex_config);


  await fastify.register(swagger, {
    title: 'User Service API',
    description: 'Endpoints for user management',
    route: '/doc/json',
    servers: [
      { url: '/friends/', description: 'Friends Service' },
      { url: '/block/', description: 'Blocked people Service' },
      { url: '/all/', description: 'People Service' }
    ],
    tags: [
      { name: 'Friends', description: 'Endpoints for managing user accounts and accessing personal or public user information.' },
      { name: 'Blocked', description: 'Endpoints related to user preferences.' },
      { name: 'All', description: 'Endpoints for get all people or get friend/blocked for specific user' },
      {name: 'Search', description: 'Endpoints for searching users by name or partial name.'}
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  });
}


