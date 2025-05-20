import * as Controller from '../controllers/gameController.js'

export default async function(fastify) {
	fastify.post('/game', Controller.getGame);	
}