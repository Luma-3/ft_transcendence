import server from './fastify.js';
import dotenv from 'dotenv'

import { handlerEvent } from './controllers/gameController.js';

dotenv.config();

await handlerEvent();

const start = async () => {
  try {
    await server.listen({ port: 3003, host: '0.0.0.0' })
    console.log(`Server listening on ${server.server.address().port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()