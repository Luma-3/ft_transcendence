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
      summary: 'delete currents user',
      description: 'Endpoint to delete current user and all its ressources',
      tags: ['Users'],
      response: {
        200: { $ref: 'BaseSchema' },
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.deleteUser);

  fastify.get('/users/me', {
    schema: {
      summary: 'Get current user private information',
      description: 'Endpoint to retrieve current user private informations',
      tags: ['Users'],
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.getMe);

  fastify.patch('/users/me/password', {
    schema: {
      summary: 'Update current user password',
      description: 'Endpoint to update current user password',
      tags: ['Users'],
      body: { $ref: 'userPasswordValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        403: { $ref: 'FORBIDDEN_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMePassword);

  fastify.patch('/users/me/email', {
    schema: {
      summary: 'Update current user email',
      description: 'Endpoint to update current user email',
      tags: ['Users'],
      body: { $ref: 'userEmailValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        409: { $ref: 'CONFLICT_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMeEmail);

  fastify.patch('/users/me/username', {
    schema: {
      summary: 'Update current user username',
      description: 'Endpoint to update current user username',
      tags: ['Users'],
      body: { $ref: 'userUsernameValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        409: { $ref: 'CONFLICT_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMeUsername);

}
