import { fastify } from './fastify.js';
import dotenv from 'dotenv'
import websocketPlugin from '@fastify/websocket';

import config from './config/fastify.config.js'

import game from './routes/game.js';

import { handlerEvent } from './controllers/gameController.js';

dotenv.config()

await config(fastify);

fastify.register(websocketPlugin);
fastify.register(game);

await handlerEvent();

fastify.addHook('onRoute', (routeOptions) => {
  console.log(`Route registered: ${routeOptions.method} ${routeOptions.url}`);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3003, host: '0.0.0.0' })
    console.log(`Server listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()