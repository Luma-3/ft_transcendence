import {randomUUID} from 'crypto'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

export async function uplaodFile(req, rep) {
	const data = await req.file();
	const buffer = await data.toBuffer();

	const __dirname = import.meta.dirname;
	

	console.log(data);
	const isImage = ['image/jpeg', 'image/png'].includes(data.mimetype);
	if (!isImage) {
		return rep.code(400).send({message: 'Invalide file type'});
	}

	const filename = `${randomUUID()}.webp`
	const outputPath = path.join(__dirname, '../uploads', filename);

	const webpBuffer = await sharp(buffer).resize(256,256).webp({quality: 80}).toBuffer();

	fs.writeFileSync(outputPath, webpBuffer);

	const fileUrl = `https://${process.env.IP}/upload/${filename}`;
	return rep.code(200).send({massage: 'Resource created', data: {
		url: fileUrl
	}})
}