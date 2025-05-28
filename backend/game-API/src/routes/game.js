import * as Controller from '../controllers/gameController.js';

export default async function(fastify) {
  // fastify.post('/games', Controller.postGame);

  fastify.post('/join', Controller.postPlayer);
  fastify.get('/:roomId', Controller.getRoomInfo);
}
