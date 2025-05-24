import { randomUUID } from 'crypto'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

export async function uplaodFile(req, rep) {
  const file = await req.file();
  const { path } = req.params;
  const fileurl = await this.UploadService.uploadFile(file, path);

  return rep.code(200).send({ message: 'file uploaded successfully', data: { Url: fileurl } })
}

export async function deleteFile(req, rep) {
  const { filename } = req.params;
  const __dirname = import.meta.dirname;

  const formatedPath = path.join(__dirname, '../uploads/', filename);
  fs.unlink(formatedPath);
}

