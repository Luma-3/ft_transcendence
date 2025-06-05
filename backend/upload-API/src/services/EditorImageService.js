import sharp from "sharp";

export class EditorImageService {
  constructor() {}


  parseValueSpecial(value, n = null) {
    if(value.includes("%")){
      return (parseInt(value.substring(0, value.indexOf("%")), 10) / 100) % 500;
    }
    const transform = parseFloat(value) % (n ?? 5);
    return transform == 0 ? 1 : transform;
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
      const data = parseFloat(size) % 4096;
      image.ptr = image.ptr.resize({
        width: data,
        height: data,
        fit: resizeMode,
      });
      return;
    }

    if (width || height) {

      const targetWidth = width ? parseInt(width, 10) : imageWidth;
      const targetHeight = height ? parseInt(height, 10) : imageHeight;
      image.ptr = image.ptr.resize({
        width: targetWidth,
        height: targetHeight,
        fit: resizeMode,
      });
      return;
    }
  }

  async applyFilter(image, options) {
      const { blur = null, grayscale = false, tint=null, greyscale=false} = options;
      // Appliquer blur si demandé
      if (blur) {
        image.ptr = image.ptr.blur(parseFloat(blur));
      }

      // Appliquer grayscale si demandé
      if (grayscale === 'true') {
        image.ptr = image.ptr.grayscale();
      }
      // Appliquer greyscale si demandé
      if (greyscale === 'true') {
        image.ptr = image.ptr.greyscale();
      }
      // Appliquer tint si demandé
      if(tint) {
        let color;
        const RGB = tint.split(",", 3);
        if(RGB.size === 3){
          for(const i = 0; i < 3; ++i)
          {
            RGB[i] = parseInt(GB[i]) % 256;
          }
          color = {
            r: RGB[0],
            g: RGB[1],
            b: RGB[2]
          }
        }else {
          color = RGB[0];
        }
        image.ptr = image.ptr.tint(color);
      }
  }

  async rotateImage(image, rotate) {
      if (rotate) {
        image.ptr = image.ptr.rotate(parseInt(rotate));
      }
  }


  async edit(buffer, options) {
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
      await this.rotateImage(image, options.rotate ?? null);
    }catch(_) {}
    try{
      return await image.ptr.toBuffer();
    }catch(_) {
      return buffer;
    }
  }
}



