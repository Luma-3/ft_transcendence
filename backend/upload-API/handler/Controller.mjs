import {randomUUID} from 'crypto'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

export async function uplaodFile(req, rep) {
	const file = await req.file();
  // const path = await req.path();
	const buffer = await file.toBuffer();

	const __dirname = import.meta.dirname;
	
	const isImage = ['image/jpeg', 'image/png', 'image/svg+xml'].includes(data.mimetype);
	if (!isImage) {
		return rep.code(400).send({message: 'Invalide file type'});
	}

	const filename = `${randomUUID()}.webp`
	const outputPath = path.join(__dirname, '../uploads', filename);

	const webpBuffer = await sharp(buffer).resize(256,256).webp({quality: 80}).toBuffer();

	fs.writeFileSync(outputPath, webpBuffer);
 
	const fileUrl = `https://${process.env.GATEWAY_IP}/uploads/${filename}`;
	return rep.code(200).send({url: fileUrl})
}

export async function deleteFile(req, rep) {
  const { filename } = req.params;
	const __dirname = import.meta.dirname;

  const formatedPath = path.join(__dirname, '../uploads/', filename);
  fs.unlink(formatedPath);
}

