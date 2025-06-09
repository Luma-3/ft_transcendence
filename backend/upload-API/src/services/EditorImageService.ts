import sharp, { Sharp } from "sharp";
import { CdnQueryType } from "../schema/upload.schema";

export class EditorImageService {
  constructor() {}


  parseValueSpecial(value: string|number, n: number|null = null) {
    if(typeof value == 'string' && value.includes("%")){
      return (parseInt(value.substring(0, value.indexOf("%")), 10) / 100) % 500;
    }
    let transform;
    if(typeof value == 'string')
      transform = parseFloat(value) % (n ?? 5);
    else
      transform = value % (n ?? 5);
    return transform == 0 ? 1 : transform;
  }

  async resizeImage(image: {
    ptr: Sharp
  }, options: CdnQueryType) {
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
      const data = this.parseValueSpecial(scale, 10);
      const newWidth = Math.round(imageWidth * data);
      const newHeight = Math.round(imageHeight * data);
      image.ptr = image.ptr.resize({
        width: newWidth,
        height: newHeight,
        fit: resizeMode,
      });
      return;
    }

    if (size) {
      let data;
      if(typeof size == 'string')
        data = parseFloat(size) % 4096;
      else
        data = size %4096;
      image.ptr = image.ptr.resize({
        width: data,
        height: data,
        fit: resizeMode,
      });
      return;
    }

    if (width || height) {
      image.ptr = image.ptr.resize({
        width: (width ?? imageWidth),
        height: (height ?? imageHeight),
        fit: resizeMode,
      });
      return;
    }
  }

  async applyFilter(image:  {
    ptr: Sharp
  }, options:  CdnQueryType) {
      const { blur, grayscale, tint, greyscale} = options;
      // Appliquer blur si demandé
      if (blur) {
        image.ptr = image.ptr.blur(blur);
      }

      // Appliquer grayscale si demandé
      if (grayscale === true) {
        image.ptr = image.ptr.grayscale();
      }
      // Appliquer greyscale si demandé
      if (greyscale === true) {
        image.ptr = image.ptr.greyscale();
      }
      // Appliquer tint si demandé
      if(tint) {
        let color: sharp.Colour;
        let RGB = tint.split(",", 4).map<number>((value) => parseInt(value) % 256);
        if(RGB.length === 3){
          color = {
            r: RGB[0],
            g: RGB[1],
            b: RGB[2],
            alpha: RGB[3]
          }
        }else {
          color = RGB[0].toString();
        }
        image.ptr = image.ptr.tint(color);
      }
  }

  async rotateImage(image: {
    ptr: Sharp
  }, rotate?: number) {
      if (rotate) {
        image.ptr = image.ptr.rotate(rotate);
      }
  }


  async edit(buffer: Buffer, options: CdnQueryType) {
    let image = {
      ptr: sharp(buffer)
    };
    try {
      await this.resizeImage(image, options);
    }catch(_) {}
    try {
      await this.applyFilter(image, options);
    }catch(_) {}
    try{
      await this.rotateImage(image, options.rotate);
    }catch(_) {}
    try{
      return await image.ptr.toBuffer();
    }catch(_) {
      return buffer;
    }
  }
}

export const editorImageService = new EditorImageService();

