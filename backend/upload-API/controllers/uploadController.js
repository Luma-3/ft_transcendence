import path from 'path';
import * as mine from 'mime-types';

export async function uplaodFile(req, rep) {
  const file = await req.file({
    limits: {
      fileSize: 4 * 1024 * 1024,
      files: 1
    }
  });
  const { typePath } = req.params;
  
  const fileurl = await this.UploadService.uploadFile(typePath, file);

  return rep.code(200).send({ message: 'file uploaded successfully', data: { Url: fileurl } })
}

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

