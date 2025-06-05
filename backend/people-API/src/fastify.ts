import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import swagger from "./plugins/swagger.js";
import formatter from "@transcenduck/formatter";
import { destroyKnex } from "./utils/knex.js";

const server = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(formatter);

await server.register(swagger, {
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

server.addHook('onClose', destroyKnex);

export default server;
