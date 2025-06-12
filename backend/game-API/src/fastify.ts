import Fastify from 'fastify'

import websocketPlugin from '@fastify/websocket';

import swagger from './plugins/swagger.js'
import formatter from '@transcenduck/formatter'

import game from './routes/game.js';

// import knex from '../plugins/knex.js'
// import knex_config from './knex.config.js'

export const server = Fastify({
  logger: true,
});

await server.register(formatter);
await server.register(websocketPlugin);
// await server.register(game);

await server.register(swagger, {
  title: 'Game Service API',
  description: 'Endpoints for game management',
  version: '1.0.0',
  route: '/doc/json',
  servers: [
      { url: '/game/', description: 'Game Service' }
  ],
  tags: [],
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

await server.register(game);

server.addHook('onRoute', (routeOptions) => {
  console.log(`Route registered: ${routeOptions.method} ${routeOptions.url}`);
});

export default server;