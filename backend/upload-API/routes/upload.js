import * as Controller from '../controllers/uploadController.js'

export default async function(fastify) {
  fastify.post('/:typePath', {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      //body: { $ref: '' },
      //params: { $ref: '' },
      response: {
        201: {},
        409: { $ref: 'CONFLICT_ERR' },
        413: {},
        415: {}
      }
    }
  }, Controller.uplaodFile);

  fastify.get('/:typePath/*', {
    schema: {
      summary: 'get file uploaded',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      //body: { $ref: '' },
      //params: { $ref: '' },
      response: {
        200: {}
      }
    }
  }, Controller.getFile);

  fastify.delete("/:typePath/*", {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      //params: { $ref: '' },
      response: {
        200: { $ref: "BaseSchema" },
        404: { $ref: "NOT_FOUND_ERR" },
        403: { $ref: "FORBIDDEN_ERR"}
      }
    }
  }, Controller.deleteFile);
}

