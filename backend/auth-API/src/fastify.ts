import fastify from "fastify";
import fs from "fs";

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cookie from "@fastify/cookie";

import swagger from "./plugin/swagger.js";
import formatter from "@transcenduck/formatter";
import { destroyKnex } from "./utils/knex.js";

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  ...(isDev && { logger: true }),
  https: {
    key: fs.readFileSync('/etc/certs/www.transcenduck.fr.key'),
    cert: fs.readFileSync('/etc/certs/www.transcenduck.fr.crt'),
  }
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(cookie);

await server.register(formatter);

await server.register(swagger, {
  title: 'Authentication Service API',
  description: 'Endpoints for managing Sessions, 2FA and OAuth2.0.',
  route: '/doc/json',
  version: '1.0.0',
  servers: [
    { url: '/auth/', description: 'Auth Service Server' }
  ],
  tags: [
    { name: 'Sessions', description: 'Endpoints for managing user sessions.' },
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
