import * as Controller from '../controllers/gameController.js'

export default async function(fastify) {
  fastify.get('/', { websocket: true }, Controller.getGame);
}
