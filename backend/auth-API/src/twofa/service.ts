import crypto from 'crypto';
import fs from 'fs';
import fetch from 'node-fetch';
import { transporter } from '../utils/mail.js';
import { redisCache } from '../utils/redis.js';
import { SendMailOptions } from 'nodemailer';
import { randomUUID } from 'crypto';
import { NotFoundError, UnauthorizedError, ConflictError } from '@transcenduck/error';
import verifyEmail from './public/html/verifyEmail.js';
import twoFaEmail from './public/html/twoFaEmail.js';
import server from '../fastify.js';

const PATH_PUBLIC = 'src/twofa/public';
const TIMEOUT_MAIL = 60; // seconds

// Charge le fichier de langue
async function loadLanguage(language: string) {
	const filePath = `./${PATH_PUBLIC}/languages/${language}.json`;
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Génère un code à 6 chiffres
export function generateCode(): string {
	return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

// Envoie l'email de vérification
async function sendVerificationEmail(email: string, token: string, language: string) {
	const trad = await loadLanguage(language);
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: trad['subject_valid_email'],
		attachments: [
			{ filename: 'fond.webp', path: `${PATH_PUBLIC}/imgs/fond.webp`, cid: 'backgroundImg' },
			{ filename: 'logo.webp', path: `${PATH_PUBLIC}/imgs/logo.webp`, cid: 'logo' },
			{ filename: 'duckHappy.png', path: `${PATH_PUBLIC}/imgs/duckHappy.png`, cid: 'duckHappy' }
		],
		html: verifyEmail(trad, process.env.URL!, token)
	};
	transporter.sendMail(mailOptions).catch(server.log.error);
}

// Envoie le code 2FA
async function send2FACode(email: string, code: string, language: string = 'en') {
	const trad = await loadLanguage(language);
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_2FA']} ${code}`,
		attachments: [
			{ filename: 'fond.webp', path: `${PATH_PUBLIC}/imgs/fond.webp`, cid: 'backgroundImg' },
			{ filename: 'logo.webp', path: `${PATH_PUBLIC}/imgs/logo.webp`, cid: 'logo' },
			{ filename: 'duckHappy.png', path: `${PATH_PUBLIC}/imgs/duckHappy.png`, cid: 'duckHappy' }
		],
		html: twoFaEmail(trad, code)
	};
	transporter.sendMail(mailOptions).catch(server.log.error);
}

// Vérifie le mail et créer l'utilisateur
async function verifyCreateUser(email: string, token: string) {
	const tokenRedis = await redisCache.get(`users:check:email:${email}`);
	if (token !== tokenRedis) {
		await redisCache.del(`users:check:token:${token}`);
		throw new ConflictError('Token not found or expired');
	}

	await fetch(`http://${process.env.USER_IP}/internal/user`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'accept': 'application/json' },
		body: JSON.stringify({ userID: token })
	});

	await fetch(`http://${process.env.USER_IP}/internal/users/${email}/account`, { method: 'PATCH' });
}

// Vérifie le mail utilisateur et le modifie
async function verifyUpdateUserEmail(email: string, token: string) {
	const rawData = await redisCache.get(`users:pendingEmail:${email}`);
	if (!rawData) throw new NotFoundError('RedisData');

	const { token: redisToken, userID } = JSON.parse(rawData) as { token: string, userID: string };
	await redisCache.del(`users:pendingEmail:${token}`);

	if (token !== redisToken) throw new ConflictError('Token not found or expired');

	await fetch(`http://${process.env.USER_IP}/internal/email`, {
		method: 'PATCH',
		headers: { 'content-type': 'application/json', 'accept': 'application/json' },
		body: JSON.stringify({ userID })
	});
}

// Service 2FA
export class TwoFaService {
	// Génère et envoie le token de vérification
	static async generateSendToken(email: string, lang: string, token?: string) {
		token ??= randomUUID();

		const cooldown = await redisCache.ttl(`users:email_cooldown:${email}`);
		if (cooldown > 0) throw new UnauthorizedError(cooldown.toString());

		await sendVerificationEmail(email, token, lang);
		await redisCache.setEx(`users:check:token:${token}`, 600, email);
		await redisCache.setEx(`users:check:email:${email}`, 600, token);
		await redisCache.setEx(`users:email_cooldown:${email}`, TIMEOUT_MAIL, '1');
	}

	// Génère et envoie le code 2FA
	static async generateSendCode(email: string, lang: string, code?: string) {
		code ??= generateCode();

		const multi = redisCache.multi();
		await send2FACode(email, code, lang);
		await multi.setEx(`users:check:code:${code}`, 600, email);
		await multi.setEx(`users:check:email:${email}`, 600, code);
		multi.exec().catch(console.error);
	}

	// Renvoie l'email si non expiré
	static async resendEmail(email: string, lang: string) {
		const token = await redisCache.get(`user:check:email${email}`);
		if (token) throw new ConflictError('Email already sent and not expired');
		await this.generateSendToken(email, lang);
	}

	// Vérifie l'email via le token
	static async verifyEmail(token: string) {
		let email = await redisCache.get(`users:pendingEmail:${token}`);
		if (email) {
			await verifyUpdateUserEmail(email, token);
		} else {
			email = await redisCache.get(`users:check:token:${token}`);
			if (!email) throw new NotFoundError('Token not found or expired');
			await verifyCreateUser(email, token);
		}

		const multi = redisCache.multi();
		multi.del(`users:check:token:${token}`);
		multi.del(`users:check:email:${email}`);
		multi.exec().catch(console.error);
	}

	// Vérifie le code 2FA
	static async verifyCode(code: string) {
		const email = await redisCache.get(`users:check:code:${code}`);
		if (!email) throw new NotFoundError('Code not found or expired');

		const codeRedis = await redisCache.get(`users:check:email:${email}`);
		if (code !== codeRedis) {
			await redisCache.del(`users:check:code:${code}`);
			throw new UnauthorizedError('Code not found or expired');
		}
		await redisCache.del(`users:check:code:${code}`);
		await redisCache.del(`users:check:email:${email}`);

		const redis2faUpdate = await redisCache.get(`users:2fa:update:${email}`);
		redisCache.del(`users:2fa:update:${email}`);

		if (!redis2faUpdate) return 'Code verified successfully';

		const response = await fetch(`http://${process.env.USER_IP}/internal/users/2fa`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json', 'accept': 'application/json' },
			body: JSON.stringify({ userID: redis2faUpdate })
		});

		const responseData = await response.json() as { message: string, status: string };
		return responseData.message;
	}
}
