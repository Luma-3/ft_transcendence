import * as Controllers from '../controllers/sessionController.js'

export default async function(fastify) {
  fastify.post('/sesssion', {
    schema: {
      summary: 'Create a Session for a user',
      description: 'Endpoint to create a Session for a user',
      tags: ['Sessions'],
      // body: { $ref: '' },
      response: {
        201: { $ref: 'BaseSchema' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controllers.postSession);


}
