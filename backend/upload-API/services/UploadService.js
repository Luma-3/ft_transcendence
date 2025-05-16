import { ForbiddenError, InvalidTypeError, NotFoundError, PayloadTooLargeError } from "@transcenduck/error";
import path from "path"
import fs from "fs";
import { randomUUID } from "crypto";
import * as mine from "mime-types";
import { pipeline } from "node:stream/promises";
export class UploadService {
  _uploadPath;
  _editorImageService;
  static _typeUpload = [
    "avatar",
    "banner"
  ];
  constructor(
    editorImageService
  ) {
    this._editorImageService = editorImageService;
    this._uploadPath = path.resolve(import.meta.dirname, "../uploads/");
    UploadService._typeUpload.forEach(element => {
      fs.mkdir(path.join(this._uploadPath, element), console.debug);
    });
  }

  async uploadFile(typePath, data) {
    if (data.file.truncated) {
      throw new PayloadTooLargeError();
    }

    const isImage = data.mimetype.startsWith("image/");
    if (!isImage) {
      throw new InvalidTypeError(`Invalid type ${data.mimetype}`, { what: 'image/* mimetype required' });
    }
    /*
        if (typePath === 'avatar') {
      webpBuffer = await sharp(buffer)
        .resize(256, 256) //TODO: A voir
        .webp({ quality: 80 })
        .toBuffer();
    } else if (typePath === 'banner') {
      webpBuffer = await sharp(buffer)
        .resize(1200, 675) // banniere de twitter (X) //TODO: A voir
        .webp({ quality: 80 })
        .toBuffer();
    }
    */
    const extension = mine.extension(data.mimetype);
    const filename = `${randomUUID()}.${extension}`;
    const outputPath = path.join(this._uploadPath, typePath, filename);
    await pipeline(data.file, fs.createWriteStream(outputPath));
    const VirtualPath = outputPath.substring(this._uploadPath.length)
    return `https://${process.env.GATEWAY_IP}/api/upload${VirtualPath}`;
  }

  async checkFile(path) {
    try {
      const stats = fs.statSync(path);
      if (!stats.isFile()) {
        throw new NotFoundError();
      }
    } catch (err) {
      throw new NotFoundError(err.message.replace(this._uploadPath, ""));
    }
  }


  async getFile(typePath, realPath, options) {
    const pathJoin = path.join(this._uploadPath, realPath);
    console.log(path.join(this._uploadPath, typePath));
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    await this.checkFile(pathJoin);

    let buffer =  fs.readFileSync(pathJoin);
    const extenstion = path.extname(pathJoin);

    if(Object.keys(options).length && [".png", ".jpeg", ".jpg", ".webp"].includes(extenstion)){
      buffer = this._editorImageService.edit(buffer, options);
    }
    return buffer;
  }

  async deleteFile(typePath, realPath) {
    const pathJoin = path.join(this._uploadPath, realPath);
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    try {
      fs.unlinkSync(pathJoin);
    }catch(err) {
      throw new NotFoundError(err.message.replace(this._uploadPath, ""));
    }
  }
}



