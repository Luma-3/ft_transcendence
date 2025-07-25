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
  private static defaultAvatar = "default.png";
  private static defaultBanner = "default.png";


  constructor(rootUpload: string) {
    this._uploadPath = path.resolve(rootUpload, "uploads");
    
    Object.keys(TypeUpload).forEach(element => {
      fs.mkdir(path.join(this._uploadPath, element), {recursive: true}, console.debug);
    });
    UploadService.defaultAvatar = path.join(this._uploadPath, TypeUpload.avatar, UploadService.defaultAvatar);
    UploadService.defaultBanner = path.join(this._uploadPath, TypeUpload.banner, UploadService.defaultBanner);
  }

  async uploadFile(typePath: string, data?: MultipartFile) {
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

    const extension = mine.extension(data.mimetype);
    const filename = `${randomUUID()}.${extension}`;
    const outputPath = path.join(this._uploadPath, typePath, filename);
    await pipeline(data.file, fs.createWriteStream(outputPath));
    const urlCDN =  `${process.env.URL}/api/uploads/${typePath}/${filename}`;
    return urlCDN;
  }

  /**
   * Verification de l'existence du fichier
   */
  async checkFile(path: string) {
    const stats = fs.statSync(path);
    if (!stats.isFile()) {
      throw new NotFoundError();
    }
  }

  /**
   * Verification de l'existence fichier,
   * appelle l'editeur si besoin (si le type correspond a un fichier image)
   * et renvoie le fichier
   */
  async getFile(typePath: string, realPath: string, options: CdnQueryType) {
    let pathJoin = path.join(this._uploadPath, realPath);
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    try {
      await this.checkFile(pathJoin);
    } catch (err) {
      pathJoin = (typePath === TypeUpload.avatar ? UploadService.defaultAvatar : UploadService.defaultBanner);
      realPath = pathJoin.substring(this._uploadPath.length);
    }
    const hashKey = 'upload:' + hash("md5", JSON.stringify({ typePath, realPath, options: {
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
    const data = await redisCache.getEx(hashKey, {type: "EX", value: 60 * 60 * 24 });
    if(data)
      return Buffer.from(await uncompress(Buffer.from(data!, 'base64')));
    let bufferFile =  fs.readFileSync(pathJoin);
    const extenstion = path.extname(pathJoin);

    if(Object.keys(options).length && [".png", ".jpeg", ".jpg", ".webp"].includes(extenstion)){
      return this.cacheFile(hashKey, await editorImageService.edit(bufferFile, options));
    }
    
    return this.cacheFile(hashKey, bufferFile);
}

public async getProxyFile(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new NotFoundError("File not found");
  }
  const bufferFile = await response.blob();
  const buffer = Buffer.from(await bufferFile.arrayBuffer());
  return {
    buffer: buffer,
    contentType: response.headers.get("content-type") || "application/octet-stream"
  };
}

  cacheFile(hashKey: string, buffer: Buffer) {
    compress(buffer).then((buffer: Buffer) => {
      redisCache.set(hashKey, buffer.toString('base64'), {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 // 24 hours
      }
      }).then(() => {
      }).catch((err) => {
        console.log("Error caching file in Redis", err);
      });
    });
    
    return buffer;
  }

  async deleteFile(typePath: string, realPath: string) {
    if (realPath.startsWith("googleusercontent.com/")) {
      throw new ForbiddenError("Cannot delete file from Google Cloud Storage");
    }
    const pathJoin = path.join(this._uploadPath, realPath);
    if (!pathJoin.startsWith(path.join(this._uploadPath, typePath))) {
      throw new ForbiddenError();
    }
    if(pathJoin === (typePath === TypeUpload.avatar ? UploadService.defaultAvatar : UploadService.defaultBanner))
      return ;
    try {
      fs.unlinkSync(pathJoin);
    }catch(err) {
      if(err instanceof Error)
        throw new NotFoundError(err.message.replace(this._uploadPath, ""));
    }
  }
}

export const uploadServices = new UploadService(path.join(import.meta.dirname, "../../"));