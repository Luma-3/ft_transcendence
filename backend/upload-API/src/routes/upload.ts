import { FastifyInstance } from 'fastify';
import * as Controller from '../controllers/uploadController.js'
import { ResponseSchema } from '../utils/schema.js';
import { CdnQuery, proxyCDN, UploadFileParams, UploadFileValidation } from '../schema/upload.schema.js';
import { ConflictResponse, ForbiddenResponse, InvalidTypeResponse, NotFoundResponse, PayloadTooLargeResponse } from '@transcenduck/error';
import { Type } from '@sinclair/typebox';
/**
 * typePath: c'est le type de fichier que l'on veux manipuler
 * typePath peut etre:
 * - avatar
 * - banner
 */
export default async function uploadRoute(fastify: FastifyInstance) {
  fastify.post('/internal/:typePath', {
    schema: {
      consumes: ['multipart/form-data'],
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: UploadFileParams,
      response: {
        201: ResponseSchema(UploadFileValidation),
        409: ConflictResponse,
        413: PayloadTooLargeResponse,
        403: ForbiddenResponse,
        415: InvalidTypeResponse
      }
    }
  }, Controller.uploadFile);

  fastify.get('/proxy', {
    schema: {
      summary: 'Proxy file from CDN',
      description: 'Endpoint to proxy file from CDN',
      tags: ['Upload'],
      querystring: proxyCDN
    },
  }, Controller.getProxyFile
  )

  fastify.get('/:typePath/*', {
    schema: {
      summary: 'get file uploaded',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: UploadFileParams,
      querystring: CdnQuery,
      response: {
        200: Type.Any({
          description: 'File content',
          content: {
            'application/octet-stream': {
              schema: Type.String({ format: 'binary' })
            }
          }
        }),
        404: NotFoundResponse
      }
    }
  }, Controller.getFile);


  fastify.delete("/internal/:typePath/*", {
    schema: {
      summary: 'Upload file',
      description: 'Endpoint to upload file',
      tags: ['Upload'],
      params: UploadFileParams,
      response: {
        200: ResponseSchema(),
        404: NotFoundResponse,
        403: ForbiddenResponse,
      }
    }
  }, Controller.deleteFile);
}

