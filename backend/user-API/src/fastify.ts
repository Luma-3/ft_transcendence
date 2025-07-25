import fastify from "fastify";

import fastifyMultipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cookie from "@fastify/cookie";

import swagger from "./plugins/swagger.js";
import formatter from "@transcenduck/formatter";
import { destroyKnex } from "./utils/knex.js";

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  ...(isDev && { logger: true }),
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(cookie);
await server.register(fastifyMultipart);

await server.register(formatter);

await server.register(swagger, {
  title: 'User Service API',
  description: 'Endpoints for user management',
  route: '/doc/json',
  version: '1.0.0',
  servers: [
    { url: '/api/user/', description: 'User Service' }
  ],
  tags: [
    { name: 'Users', description: 'Endpoints for managing user accounts and accessing personal or public user information.' },
    { name: 'Sessions', description: 'Endpoints related to user session creation and termination.' },
    { name: 'Preferences', description: 'Endpoints related to user preferences.' }
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
