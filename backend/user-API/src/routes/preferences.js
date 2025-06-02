import * as Controller from '../controllers/preferencesController.js'

export default async function(fastify) {

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
  fastify.patch('/users/me/preferences/avatar', {
    schema: {
      summary: 'Update current user preferences',
      description: 'Endpoint to update current user preferences',
      tags: ['Preferences'],
      //body: { $ref: 'preferencesValidation' },
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateAvatarPreferences);

  fastify.patch('/users/me/preferences/banner', {
    schema: {
      summary: 'Update current user preferences',
      description: 'Endpoint to update current user preferences',
      tags: ['Preferences'],
      //body: { $ref: 'preferencesValidation' },
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateBannerPreferences);

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
