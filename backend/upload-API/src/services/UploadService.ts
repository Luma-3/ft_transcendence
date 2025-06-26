import { ForbiddenError, InvalidTypeError, NotFoundError, PayloadTooLargeError } from "@transcenduck/error";
import path from "path"
import fs from "fs";
import { randomUUID } from "crypto";
import * as mine from "mime-types";
import { pipeline } from "node:stream/promises";
import { editorImageService } from "./EditorImageService.js";
import { MultipartFile } from "@fastify/multipart";
import { CdnQueryType } from "../schema/upload.schema.js";
import { redisCache } from "../utils/redis.js";
import { hash } from "node:crypto";
import { compress, uncompress } from "snappy";
export enum TypeUpload {
  avatar = 'avatar',
  banner = 'banner'
};


export class UploadService {
  _uploadPath: string;
  
  
  constructor(rootUpload: string) {
    this._uploadPath = path.resolve(rootUpload, "uploads");
    
    Object.keys(TypeUpload).forEach(element => {
      fs.mkdir(path.join(this._uploadPath, element), {recursive: true}, console.debug);
    });
  }

  async uploadFile(typePath: string, data?: MultipartFile) {
    console.log(data)
    if (!data) {
      throw new ForbiddenError("file not send");
    }
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
    return filename;
  }

  /**
   * Verification de l'existence du fichier
   */
  async checkFile(path: string) {
    try {
      const stats = fs.statSync(path);
      if (!stats.isFile()) {
        throw new NotFoundError();
      }
    } catch (err) {
      if(err instanceof Error)
        throw new NotFoundError(err.message.replace(this._uploadPath, ""));
    }
  }

  /**
   * Verification de l'existence fichier,
   * appelle l'editeur si besoin (si le type correspond a un fichier image)
   * et renvoie le fichier
   */
  async getFile(typePath: string, realPath: string, options: CdnQueryType) {
    const pathJoin = path.join(this._uploadPath, realPath);
		console.log(pathJoin, path.join(this._uploadPath, typePath));
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    await this.checkFile(pathJoin);
    const hashKey = 'upload.'+  hash("md5", JSON.stringify({ typePath, realPath, options: {
        size: options.size,
        scale: options.scale,
        width: options.width,
        height: options.height,
        resizeMode: options.resizeMode,
        blur: options.blur,
        grayscale: options.grayscale,
        greyscale: options.greyscale,
        tint: options.tint,
        rotate: options.rotate,
    }}));
    if(await redisCache.exists(hashKey))
      return redisCache.getEx(hashKey, {type: "EX", value: 60 * 60 * 24 }).then(async (data) => {
          return await uncompress(Buffer.from(data!, 'base64'));
      });
    let bufferFile =  fs.readFileSync(pathJoin);
    const extenstion = path.extname(pathJoin);

    if(Object.keys(options).length && [".png", ".jpeg", ".jpg", ".webp"].includes(extenstion)){
      return this.cacheFile(hashKey, await editorImageService.edit(bufferFile, options));
    }
    
    return this.cacheFile(hashKey, bufferFile);
}

  cacheFile(hashKey: string, buffer: Buffer) {
    compress(buffer).then((buffer: Buffer) => {
      redisCache.set(hashKey, buffer.toString('base64'), {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 // 24 hours
      }
      }).then(() => {
        console.log("File cached in Redis");
      }).catch((err) => {
        console.error("Error caching file in Redis", err);
      }); // Cache for 24 hours
    });
    
    return buffer;
  }

  async deleteFile(typePath: string, realPath: string) {
    const pathJoin = path.join(this._uploadPath, realPath);
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    try {
      fs.unlinkSync(pathJoin);
    }catch(err) {
      if(err instanceof Error)
        throw new NotFoundError(err.message.replace(this._uploadPath, ""));
    }
  }
}

export const uploadServices = new UploadService(path.join(import.meta.dirname, "../../"));