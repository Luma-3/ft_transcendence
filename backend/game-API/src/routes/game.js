import * as ControllerOnline from '../controllers/gameControllerOnline.js';
import * as ControllerLocal from '../controllers/gameControllerLocal.js';
import * as Controller from '../controllers/gameController.js';


export default async function(fastify) {
  fastify.get('/online/', { websocket: true }, ControllerOnline.launchGame);


  fastify.post('/local/init', ControllerLocal.initGame);
  fastify.post('/local/input', ControllerLocal.HandleInput);
  fastify.get('/local/state', ControllerLocal.getState);

  fastify.post('/games', Controller.postGame);
}
