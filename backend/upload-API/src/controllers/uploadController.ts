import path from 'path';
import * as mine from 'mime-types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TypeUpload, uploadServices } from '../services/UploadService.js';
import { CdnQueryType, UploadFileParamsType } from '../schema/upload.schema.js';



/**
 * Post Image, si image > 4Mo, on accepte pas
 */
export async function uploadFile(req: FastifyRequest<{
  Params: UploadFileParamsType
}>, rep: FastifyReply) {
  const { typePath } = req.params;
  const file = await req.file({
    limits: {
      fileSize: (typePath == TypeUpload.avatar ? (1 * 1024 * 1024) : (20 * 1024 * 1024)), // 4Mio pour les images, 20Mio pour les autres types
      files: 1
    }
  });
  const fileurl = await uploadServices.uploadFile(typePath, file);

  return rep.code(200).send({ message: 'file uploaded successfully', data: { Url: fileurl } })
}

/**
 * Recuperation du URI de la requete, separation des infos (typePath, url, query)
 * verification du content-type et si la demande et le fichier ne correspondent pas
 * ERROR 403
 */
export async function getFile(req: FastifyRequest<{
  Params: UploadFileParamsType,
  Querystring: CdnQueryType
}>, rep: FastifyReply) {
  const findQuery = req.url.indexOf("?");
  const url = findQuery != -1 ? req.url.substring(0, findQuery) : req.url;
  const { typePath } = req.params;

  const buffer = await uploadServices.getFile(typePath, url, req.query);

  return rep.code(200).header('Content-Type', mine.contentType(path.extname(url))).send(buffer);
}

export async function deleteFile(req: FastifyRequest<
  {
  Params: UploadFileParamsType
}>, rep: FastifyReply) {
  const path = req.url;
  const { typePath } = req.params;

  await uploadServices.deleteFile(typePath, path);

  return rep.code(200).send({ message: 'file deleted successfully' })
}

