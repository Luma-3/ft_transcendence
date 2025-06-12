import { InternalServerError } from '@transcenduck/error';
import { PreferencesService } from '../services/preferencesService.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserHeaderIdType } from '../schema/user.schema.js';
import { PREFERENCES_PRIVATE_COLUMNS } from '../models/preferencesModel.js';

export async function updateAvatarPreferences(req: FastifyRequest<{
	Headers: UserHeaderIdType;
}>, rep: FastifyReply) {
	const userID = req.headers['x-user-id'];

	const oldPreferences = await PreferencesService.getPreferences(userID, ["avatar"]);
	const file = await req.file({
		limits: {
			fileSize: 1024 * 1024 * 4, // 5MB
			files: 1
		}
	});
	if (!file) {
		return rep.code(400).send({ message: 'No file uploaded' });
	}
	let info;
	const formData = new FormData();
	formData.append('avatar', new Blob([await file.toBuffer() as any], {type: file.mimetype}), file.filename);
	console.log(formData)
	const fetchUrl = await fetch('http://' + process.env.UPLOAD_IP + '/internal/avatar', {
			method: 'POST',
			headers: {},
			body: formData
		});
	try {
		info = await fetchUrl.json();
	}
	catch (err) {
		if (err instanceof Error) {
			throw new InternalServerError(err.message, 'Error while uploading avatar');
		}
	}
	if (!fetchUrl.ok) {
		return rep.code(fetchUrl.status).send(info);
	}
	if (oldPreferences.avatar && oldPreferences.avatar !== 'default.png') {
		await fetch('http://' + process.env.UPLOAD_IP + '/internal/avatar/' + oldPreferences.avatar, {
			method: 'DELETE'
		});
	}
	const preferences = await PreferencesService.updatePreferences(userID, { avatar: info.data.Url }, PREFERENCES_PRIVATE_COLUMNS);
	return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function updateBannerPreferences(req: FastifyRequest<{
	Headers: UserHeaderIdType;
}>, rep: FastifyReply) {
	const userID = req.headers['x-user-id'];

	const oldPreferences = await PreferencesService.getPreferences(userID, ["banner"]);
	const file = await req.file({
		limits: {
			fileSize: 20 * 1024 * 1024, // 20Mio for banner
			files: 1
		}
	});
	if (!file) {
		return rep.code(400).send({ message: 'No file uploaded' });
	}
	let info;
	const formData = new FormData();
	formData.append('banner', new Blob([await file.toBuffer()  as any], {type: file.mimetype}), file.filename);
	const fetchUrl = await fetch('http://' + process.env.UPLOAD_IP + '/internal/banner', {
			method: 'POST',
			headers: {},
			body: formData
		});
	try {
		info = await fetchUrl.json();
	}
	catch (err) {
		if (err instanceof Error) {
			throw new InternalServerError(err.message, 'Error while uploading banner');
		}
	}
	if (!fetchUrl.ok) {
		return rep.code(fetchUrl.status).send(info);
	}
	if (oldPreferences.banner && oldPreferences.banner !== 'default.png') {
		await fetch('http://' + process.env.UPLOAD_IP + '/internal/banner/' + oldPreferences.banner, {
			method: 'DELETE'
		});
	}
	const preferences = await PreferencesService.updatePreferences(userID, { banner: info.data.Url }, PREFERENCES_PRIVATE_COLUMNS);
	return rep.code(200).send({ message: 'Ok', data: preferences });
}
