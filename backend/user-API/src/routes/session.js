import * as Controllers from '../controllers/sessionController.js'

export default async function(fastify) {
  fastify.post('/session', {
    schema: {
      summary: 'Create a Session for a user',
      description: 'Endpoint to create a Session for a user',
      tags: ['Sessions'],
      body: { $ref: 'sessionCreateValidation' },
      response: {
        201: { $ref: 'BaseSchema' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controllers.postSession);


  fastify.delete('/session', {
    schema: {
      summary: 'Delete a Session for a user',
      description: 'Endpoint to delete a Session for a user',
      tags: ['Sessions'],
      response: {
        200: { $ref: 'BaseSchema' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controllers.deleteSession);

  fastify.post('/session/refresh', {
    schema: {
      summary: 'Refresh a Session for a user',
      description: 'Endpoint to refresh a Session for a user',
      tags: ['Sessions'],
      response: {
        200: { $ref: 'BaseSchema' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controllers.refreshSession);

  fastify.get('/session/verify/accessToken', {
    schema: {
      summary: 'Verify access token session for a user',
      description: 'Endpoint to verify access token',
      tags: ['Sessions'],
      response: {
        200: {}
      }
    }
  }, Controllers.verifyAccessToken);

  fastify.get('/session/verify/refreshToken', {
    schema: {
      summary: 'Verify refresh token session for a user',
      description: 'Endpoint to verify refresh token',
      tags: ['Sessions'],
      response: {
        200: {}
      }
    }
  }, Controllers.verifyRefreshToken);
}

