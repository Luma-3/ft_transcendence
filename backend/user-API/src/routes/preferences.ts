import * as Controller from '../controllers/preferencesController.js'
import { FastifyPluginAsync, FastifyInstance } from 'fastify';

const route: FastifyPluginAsync = async (fastify: FastifyInstance) => {

  fastify.get('/users/me/preferences', {
    schema: {
      summary: 'Get current user preferences',
      description: 'Endpoint to retrieve current user preferences',
      tags: ['Preferences'],
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.getMePreferences);

  fastify.patch('/users/me/preferences', {
    schema: {
      summary: 'Update current user preferences',
      description: 'Endpoint to update current user preferences',
      tags: ['Preferences'],
      body: { $ref: 'preferencesValidation' },
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updatePreferences);

  fastify.get('/users/:userID/preferences', {
    schema: {
      summary: 'Get user preferences',
      description: 'Endpoint to retrieve user preferences',
      tags: ['Preferences'],
      response: {
        200: { $ref: 'preferencesPublicBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
      }
    }
  }, Controller.getUserPreferences);
}

export default route;
