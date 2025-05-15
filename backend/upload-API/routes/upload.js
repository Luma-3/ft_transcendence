import * as Controller from '../controllers/userController.js'

export default async function(fastify) {
  fastify.post('/upload', {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      body: { $ref: '' },
      response: {
        201: {},
        409: { $ref: 'CONFLICT_ERR' },
        413: {},
        415: {},
      }
    }
  }, Controller.uplaodFile);
}

