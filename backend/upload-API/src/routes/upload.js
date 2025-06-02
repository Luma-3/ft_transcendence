import * as Controller from '../controllers/uploadController.js'
/**
 * typePath: c'est le type de fichier que l'on veux manipuler
 * typePath peut etre:
 * - avatar
 * - banner
 */
export default async function(fastify) {
  fastify.post('/:typePath', {
    schema: {
      consumes: ['multipart/form-data'],
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      //body: { $ref: 'uploadFilePublic' },//TODO: regle le proble du schema pour le multipart form
      params: { $ref: 'uploadFileParams' },
      response: {
        201: { $ref: "uploadFileValidation"},
        409: { $ref: 'CONFLICT_ERR' },
        413: { $ref: 'PAYLOAD_TOO_LARGE_ERR' },
        403: { $ref: "FORBIDDEN_ERR"},
        415: { $ref: 'INVALID_TYPE_ERR' }
      }
    }
  }, Controller.uploadFile);

  fastify.get('/:typePath/*', {
    schema: {
      summary: 'get file uploaded',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: { $ref: 'uploadFileParams' },
      response: {
        200: {},
        404: { $ref: "NOT_FOUND_ERR" },
      }
    }
  }, Controller.getFile);

  fastify.delete("/:typePath/*", {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: { $ref: 'uploadFileParams' },
      response: {
        200: { $ref: "BaseSchema" },
        404: { $ref: "NOT_FOUND_ERR" },
        403: { $ref: "FORBIDDEN_ERR"}
      }
    }
  }, Controller.deleteFile);
}

