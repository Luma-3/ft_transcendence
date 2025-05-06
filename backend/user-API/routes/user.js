import * as Controller from '../controllers/userController.js'

export default async function(fastify) {
  fastify.post('/users', {
    schema: {
      description: 'Create a user',
      tags: ['Users'],
      response: {
        201: fastify.swSchemaFormat({
          description: 'description',
          data: fastify.swPayloadFormat('userInfoPublic')
        }),
        409: { $ref: 'CONFLICT_ERR' },
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
