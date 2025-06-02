import path from 'path';
import * as mine from 'mime-types';



/**
 * Post Image, si image > 4Mo, on accepte pas
 */
export async function uploadFile(req, rep) {
  const { typePath } = req.params;
  const file = await req.file({
    limits: {
      fileSize: typePath == "avatar" ? (4 * 1024 * 1024) : (20 * 1024 * 1024), // 4Mio pour les images, 20Mio pour les autres types
      files: 1
    }
  });
  
  const fileurl = await this.UploadService.uploadFile(typePath, file);

  return rep.code(200).send({ message: 'file uploaded successfully', data: { Url: fileurl } })
}

/**
 * Recuperation du URI de la requete, separation des infos (typePath, url, query)
 * verification du content-type et si la demande et le fichier ne correspondent pas
 * ERROR 403
 */
export async function getFile(req, rep) {
  const url = Object.keys(req.query).length ? req.url.substring(0, req.url.indexOf("?")) : req.url;
  const { typePath } = req.params;

  const buffer = await this.UploadService.getFile(typePath, url, req.query);

  return rep.code(200).header('Content-Type', mine.contentType(path.extname(url))).send(buffer);
}

export async function deleteFile(req , rep) {
  const path = req.url;
  const { typePath } = req.params;

  await this.UploadService.deleteFile(typePath, path);

  return rep.code(200).send({ message: 'file deleted successfully' })
}

