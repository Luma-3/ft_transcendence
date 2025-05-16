import { ForbiddenError, InvalidTypeError, NotFoundError } from "@transcenduck/error";
import path from "path"
import fs from "fs";
import { randomUUID } from "crypto";
import sharp from "sharp";

export class UploadService {
  __uploadPath;
  __typeUpload = [
    "avatar",
    "banner"
  ];
  constructor() {
    this.__uploadPath = path.resolve(import.meta.dirname, "../uploads/");
    this.__typeUpload.forEach(element => {
      fs.mkdir(path.join(this.__uploadPath, element), console.debug);
    });
  }

  async uploadFile(typePath, file) {
    if(!this.__typeUpload.includes(typePath))
      throw new InvalidTypeError(`Invalid type ${typePath}`, { what: 'type upload required' });
    const buffer = await file.toBuffer();

    const isImage = file.mimetype.startsWith("image/");
    if (!isImage) {
      throw new InvalidTypeError(`Invalid type ${file.mimetype}`, { what: 'image/* mimetype required' });
    }

    const filename = `${randomUUID()}.webp`;
    console.log(this.__uploadPath, "\n" ,  typePath, filename);
    const outputPath = path.join(this.__uploadPath, typePath, filename);

    let webpBuffer;
    if (typePath === 'avatar') {
      webpBuffer = await sharp(buffer)
        /*.resize(256, 256)*/ //TODO: A voir
        .webp({ quality: 80 })
        .toBuffer();
    } else if (typePath === 'banner') {
      webpBuffer = await sharp(buffer)
        /*.resize(1200, 675)*/ // banniere de twitter (X) //TODO: A voir
        .webp({ quality: 80 })
        .toBuffer();
    }
    fs.writeFileSync(outputPath, webpBuffer, {
      flag: "a+"
    });
    const VirtualPath = outputPath.substring(this.__uploadPath.length)
    return `https://${process.env.GATEWAY_IP}/api/upload${VirtualPath}`;
  }

  unlinkAsync(path) {
    return new Promise((resolve, reject) => {
      fs.unlink( path, (err) => {
          if(err)
            reject(err);
          resolve();
        }
      );
    });
  }

  async checkFile(path) {
    console.log(path)
  try {
    const stats = fs.statSync(path);
    if (!stats.isFile()) {
      throw new NotFoundError('Le chemin ne correspond pas à un fichier');
    }else if (stats.size > 4 * 1024 * 1024) { // 4 Mo
      throw new NotFoundError("Payload to large");
    }
  } catch (err) {
    throw new NotFoundError(err.message.replace(this.__uploadPath, ""));
  }
}

parseValueSpecial(value) {
  if(value.includes("%")){
    return parseInt(value.substring(0, value.indexOf("%")), 10) / 100;
  }
  return parseFloat(value);
}

async resizeImage(image, options) {
  // options: { size?: number, scale?: number, width?: number, height?: number, resizeMode?: string }
  const {
    size = null,
    scale = null,
    width = null,
    height = null,
    resizeMode = 'fill',
  } = options;
  const metadata = await image.ptr.metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;
  if (scale) {
    const data = this.parseValueSpecial(scale);
    const newWidth = Math.round(imageWidth * data);
    const newHeight = Math.round(imageHeight * data);
    console.log({
      "scale": data,
      newWidth,
      newHeight
    })
    image.ptr = image.ptr.resize({
      width: newWidth,
      height: newHeight,
      fit: resizeMode,
    });
    return;
  }

  if (size) {
    const data = this.parseValueSpecial(size);
    image.ptr = image.ptr.resize({
      width: data,
      height: data,
      fit: resizeMode,
    });
    return;
  }

  if (width || height) {

    const aspectRatio = imageWidth / imageHeight;

    const targetWidth = width ? parseInt(width, 10) : null;
    const targetHeight = height ? parseInt(height, 10) : null;

    // Calculer la nouvelle largeur et hauteur selon le ratio
    let newWidth, newHeight;
    if (targetWidth && targetHeight) {
      const targetRatio = targetWidth / targetHeight;
      if (targetRatio > aspectRatio) {
        newHeight = targetHeight;
        newWidth = Math.round(newHeight * aspectRatio);
      } else {
        newWidth = targetWidth;
        newHeight = Math.round(newWidth / aspectRatio);
      }
    } else if (targetWidth) {
      newWidth = targetWidth;
      newHeight = Math.round(newWidth / aspectRatio);
    } else if (targetHeight) {
      newHeight = targetHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    }

    console.log({ targetWidth, targetHeight, newWidth, newHeight });

    image.ptr = image.ptr.resize({
      width: newWidth,
      height: newHeight,
      fit: resizeMode,
    });
    return;
  }
}


  async getFile(typePath, realPath, option) {
    if(!this.__typeUpload.includes(typePath))
      throw new ForbiddenError();
    const pathJoin = path.join(this.__uploadPath, realPath);
    if(!pathJoin.startsWith(this.__uploadPath))
      throw new ForbiddenError();
    await this.checkFile(pathJoin);
    let buffer =  fs.readFileSync(pathJoin);
    if(option){
      let image = {
        ptr: sharp(buffer)
      };
      const { blur, grayscale, rotate } = option;
      await this.resizeImage(image, option);

      // Appliquer blur si demandé
      if (blur) {
        image.ptr = image.ptr.blur(parseFloat(blur));
      }

      // Appliquer grayscale si demandé
      if (grayscale === 'true') {
        image.ptr = image.ptr.grayscale();
      }

      // Appliquer rotation si demandé
      if (rotate) {
        image.ptr = image.ptr.rotate(parseInt(rotate));
      }
      buffer = image.ptr.toBuffer();
    }
    return buffer;
  }

  async deleteFile(typePath, realPath) {
    if(!this.__typeUpload.includes(typePath))
      throw new ForbiddenError();
    const pathJoin = path.join(this.__uploadPath, realPath);

    if(!pathJoin.startsWith(this.__uploadPath))
      throw new ForbiddenError();
    try {
      fs.unlinkSync(pathJoin);
    }catch(err) {
      throw new NotFoundError(err.message.replace(this.__uploadPath, ""));
    }
  }
}



