import * as Controller from '../controllers/gameController.js'

export default async function(fastify) {
  fastify.get('/game', Controller.getGame);
}
