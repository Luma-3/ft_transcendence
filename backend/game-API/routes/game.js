import * as Controller from '../controllers/gameController.js';

export default async function(fastify) {
  fastify.get('/ws', { websocket: true }, async (connection, req) => {
      console.log("connection: ", connection);
  })
}
