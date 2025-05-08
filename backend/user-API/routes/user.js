import * as Controller from '../controllers/userController.js'

export default async function(fastify) {
  fastify.post('/users', {
    schema: {
      summary: 'Create a user',
      description: 'Endpoint to create a user ressources and retrieve public informations',
      tags: ['Users'],
      body: { $ref: 'userCreateValidation' },
      response: {
        201: { $ref: 'userInfoPublicBase' },
        409: { $ref: 'CONFLICT_ERR' },
      }
    }
  }, Controller.postUser);

  fastify.get('/users/:userID', {
    schema: {
      summary: 'Public information of user',
      description: 'Endpoint to retrieve public informations of a user',
      tags: ['Users'],
      response: {
        200: { $ref: 'userInfoPublicBase' },
        404: { $ref: 'NOT_FOUND_ERR' }
      }
    }
  }, Controller.getUser);

  fastify.delete('/users/me', {
    schema: {
      summary: 'delete currents session user',
      description: 'Endpoint to delete current session user',
      tags: ['Users'],
      response: {
        200: { $ref: 'BaseSchema' },
        404: { $ref: 'NOT_FOUND_ERR' }
      }
    }
  }, Controller.deleteUser);

  // fastify.put('/users/:userID', {
  //
  // });

  fastify.get('/users/me', {

  }, Controller.getMe);

  // fastify.put('/users/me');


}
