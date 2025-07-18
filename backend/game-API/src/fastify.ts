import fastify from 'fastify'

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import websocketPlugin from '@fastify/websocket';

import swagger from './plugin/swagger.js'
import formatter from '@transcenduck/formatter'

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  ...(isDev && { logger: true }),
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(websocketPlugin);

await server.register(formatter);

await server.register(swagger, {
  title: 'Game Service API',
  description: 'Endpoints for managing room, game and tournament.',
  route: '/doc/json',
  version: '1.0.0',
  servers: [
    { url: '/game/', description: 'Game Service' }
  ],
  tags: [
    { name: 'Room', description: 'Endpoints for managing room.' }
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

export default server;
