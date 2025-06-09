import { FastifyInstance } from 'fastify';
import * as Controller from '../controllers/uploadController.js'
import { ResponseSchema } from '../utils/schema.js';
import { CdnQuery, UploadFileParams, UploadFileValidation } from '../schema/upload.schema.js';
import { ConflictResponse , ForbiddenResponse, InvalidTypeResponse, NotFoundResponse, PayloadTooLargeResponse } from '@transcenduck/error';
/**
 * typePath: c'est le type de fichier que l'on veux manipuler
 * typePath peut etre:
 * - avatar
 * - banner
 */
export default async function(fastify: FastifyInstance) {
  fastify.post('/:typePath', {
    schema: {
      consumes: ['multipart/form-data'],
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      //body: { $ref: 'uploadFilePublic' },//TODO: regle le proble du schema pour le multipart form
      params: UploadFileParams,
      response: {
        201: ResponseSchema(UploadFileValidation),
        409: ResponseSchema(ConflictResponse, undefined, "error"),
        413: ResponseSchema(PayloadTooLargeResponse, undefined, "error"),
        403: ResponseSchema(ForbiddenResponse, undefined, "error"),
        415: ResponseSchema(InvalidTypeResponse, undefined, "error")
      }
    }
  }, Controller.uploadFile);

  fastify.get('/:typePath/*', {
    schema: {
      summary: 'get file uploaded',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: UploadFileParams,
      querystring: CdnQuery,
      response: {
        200: {},
        404: ResponseSchema(NotFoundResponse, undefined, "error")
      }
    }
  }, Controller.getFile);

  fastify.delete("/:typePath/*", {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: UploadFileParams,
      response: {
        200: ResponseSchema(),
        404: ResponseSchema(NotFoundResponse, undefined, "error"),
        403: ResponseSchema(ForbiddenResponse, undefined, "error")
      }
    }
  }, Controller.deleteFile);
}

