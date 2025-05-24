import { } from "@transcenduck/error";
import path from "path"

export class UploadService {
  constructor() { }

  async uploadFile(file, pathfile) {
    const buffer = await file.toBuffer();
    const __dirname = import.meta.dirname;

    const isImage = ['image/webp'].includes(data.mimetype);
    if (!isImage) {
      throw new InvalidTypeError(`Invalid type ${data.mimetype}`, { what: 'image/webp mimetype required' });
    }

    const filename = `${randomUUID()}.webp`
    const outputPath = path.join(__dirname, `../uploads/${pathfile}`, filename);

    let webpBuffer;
    if (path === 'avatar') {
      webpBuffer = await sharp(buffer)
        .resize(256, 256)
        .webp({ quality: 80 })
        .toBuffer();
    } else if (path === 'banner') {
      webpBuffer = await sharp(buffer)
        .resize(1200, 675) // banniere de twitter (X)
        .webp({ quality: 80 })
        .toBuffer();
    }

    fs.writeFileSync(outputPath, webpBuffer);

    return `https://${process.env.GATEWAY_IP}/api/upload/${outputPath}`;
  }
}



