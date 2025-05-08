import * as Controller from '../controllers/preferencesController.js'

export default async function(fastify) {

  fastify.get('/preferences', {
    schema: {
      summary: 'Get current user preferences',
      description: 'Endpoint to retrieve current user preferences',
      tags: ['Preferences'],
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.getPreferences);

  fastify.patch('/preferences', {
    schema: {
      summary: 'Update current user preferences',
      description: 'Endpoint to update current user preferences',
      tags: ['Preferences'],
      body: { $ref: 'preferencesValidation' },
      response: {
        200: { $ref: 'preferencesPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updatePreferences);

}
