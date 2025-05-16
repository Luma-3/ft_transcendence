import { randomUUID } from 'crypto'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { assert } from 'console';

export async function uplaodFile(req, rep) {
  const file = await req.file();
  const { typePath } = req.params;
  const fileurl = await this.UploadService.uploadFile(typePath, file);

  return rep.code(200).send({ message: 'file uploaded successfully', data: { Url: fileurl } })
}

export async function getFile(req, rep) {
  const url = req.url;
  const { typePath } = req.params;
  const buffer = await this.UploadService.getFile(typePath, Object.keys(req.query).length ? req.url.substring(0, req.url.indexOf("?")) : req.url , req.query);
  return rep.code(200).header('Content-Type', 'image/webp').send(buffer);
}

export async function deleteFile(req , rep) {
  const path = req.url;
  const { typePath } = req.params;
  await this.UploadService.deleteFile(typePath, path);
  return rep.code(200).send({ message: 'file deleted successfully' })
}

