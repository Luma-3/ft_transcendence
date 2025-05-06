import * as Controller from '../controllers/userController.js'

export default async function(fastify) {
  fastify.post('/users', {
    schema: {
      description: 'Create a user',
      tags: ['Users'],
      response: {
        200: {}
      }
    }
  }, Controller.postUser);

  fastify.get('/users/:userID', {

  }, Controller.getUser);

  // fastify.delete('/users/:userID', {
  //
  // });
  //
  // fastify.put('/users/:userID', {
  //
  // });

  fastify.get('/users/me', {

  }, Controller.getMe);

  // fastify.put('/users/me');


}
