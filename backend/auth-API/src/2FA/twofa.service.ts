import crypto from 'crypto';
import fs from 'fs';

import { transporter } from '../utils/mail.js';
import { redisCache } from '../utils/redis.js';
import { SendMailOptions } from 'nodemailer'
import { randomUUID } from 'crypto';
import fetch from 'node-fetch'

import { NotFoundError, UnauthorizedError, ConflictError } from '@transcenduck/error';

import verifyEmail from './public/html/verifyEmail.js';
import twoFaEmail from './public/html/twoFaEmail.js';

const path_public = 'src/2FA/public';

async function loadLang(language: string){
  const trad = JSON.parse(fs.readFileSync(`./${path_public}/languages/${language}.json`, 'utf8'));
	return trad;
}

export function generateCode(): string {
	const code = crypto.randomInt(0, 1000000);
	return code.toString().padStart(6, '0');
}

async function sendVerificationEmail(email: string, data: string, language: string) {
	const trad = await loadLang(language);
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_valid_email']}`,
		attachments: [
			{
				filename: 'fond.webp',
				path: path_public + '/imgs/fond.webp',
				cid: 'backgroundImg'
			},
			{
				filename: 'logo.webp',
				path: path_public + '/imgs/logo.webp',
				cid: 'logo'
			},
			{
				filename: 'duckHappy.png',
				path: path_public + '/imgs/duckHappy.png',
				cid: 'duckHappy'
			}
		],
		html: verifyEmail(trad, process.env.URL!, data)
	}
	await transporter.sendMail(mailOptions);
}

async function send2FACode(email: string, code: string, language?: string) {
	const trad = await loadLang(language ?? 'en');
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_2FA']} ${code}`,
		attachments: [
			{
				filename: 'fond.webp',
				path: path_public + '/imgs/fond.webp',
				cid: 'backgroundImg'
			},
			{
				filename: 'logo.webp',
				path: path_public + '/imgs/logo.webp',
				cid: 'logo'
			},
			{
				filename: 'duckHappy.png',
				path: path_public + '/imgs/duckHappy.png',
				cid: 'duckHappy'
			}
		],
		html: twoFaEmail(trad, code)
	}
	await transporter.sendMail(mailOptions);
}

async function verifyCreateUser( email: string, token: string ) {
	const tokenRedis = await redisCache.get("users:check:email:" + email);
	if (token !== tokenRedis) {
		await redisCache.del("users:check:token:" + token);
		throw new ConflictError("Token not found or expired");
	}

	await fetch(`http://${process.env.USER_IP}/internal/user`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
		},
		body: JSON.stringify({ userID: token })
	})

	await fetch(`http://${process.env.USER_IP}/users/internal/activeAccount/${email}`, {
		method: 'PATCH'
	})
}

async function verifyUpdateUserEmail( email: string, token: string ) {
	const rawDataRedis = await redisCache.get(`users:pendingEmail:${email}`);
	if (!rawDataRedis) {
		throw new NotFoundError('RedisData');
	}

	const dataRedis = JSON.parse(rawDataRedis) as { token: string, userID: string }

	await redisCache.del(`users:pendingEmail:${token}`);
	
	if (token !== dataRedis.token) {
		throw new ConflictError("Token not found or expired");
	}

	await fetch(`http://${process.env.USER_IP}/internal/email`, {
		method: 'PATCH',
		headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
		},
		body: JSON.stringify({ userID: dataRedis.userID })
	})
}

export class twoFaService {
	static async generateSendToken(email: string, lang: string, token?: string) {
		if (!token)
			token = randomUUID();
		sendVerificationEmail(email, token, lang);
		await redisCache.setEx("users:check:token:" + token, 600, email);
		await redisCache.setEx("users:check:email:" + email, 600, token);
	}

	static async generateSendCode(email: string, lang: string, code?: string) {
		if (!code)
			code = generateCode();

		const multi = redisCache.multi();		
		send2FACode(email, code, lang);
		await multi.setEx("users:check:code:" + code, 600, email);
		await multi.setEx("users:check:email:" + email, 600, code);

		multi.exec().catch(console.error);
	}

	static async resendEmail(email: string, lang: string) {
		const token = await redisCache.get("user:check:email" + email);
		if (token) {
			throw new ConflictError('Email already sent and not expired');
		}
		this.generateSendToken(email, lang);
	}

	static async verifyEmail(token: string) {
		let email = await redisCache.get(`users:pendingEmail:${token}`)
		if (email) {
			await verifyUpdateUserEmail(email, token);
		} else {
			email = await redisCache.get("users:check:token:" + token);
			if (!email) throw new NotFoundError("Token not found or expired");
			await verifyCreateUser(email, token);			
		}

		const multi = redisCache.multi();
		multi.del("users:check:token:" + token);
		multi.del("users:check:email:" + email);
		multi.exec().catch(console.error);
	}

	static async verifyCode(code: string) {
		const email = await redisCache.get("users:check:code:" + code);
		if (!email) throw new NotFoundError("Code not found or expired");

		const codeRedis = await redisCache.get("users:check:email:" + email);
		if (code !== codeRedis) {
			await redisCache.del("users:check:code:" + code);
			throw new UnauthorizedError("Code not found or expired");
		}
		await redisCache.del("users:check:code:" + code);
		await redisCache.del("users:check:email:" + email);

		const redis2faUpdate = await redisCache.get("users:2fa:update:" + email);
		redisCache.del("users:2fa:update:" + email);

		if (!redis2faUpdate) {
			return 'Code verified successfully';
		}

		const response = await fetch(`http://${process.env.USER_IP}/internal/users/2fa/activate`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
        'accept': 'application/json'
      },
			body: JSON.stringify({ userID: redis2faUpdate })
		})

		const reponseData = await response.json() as { message: string, status: string};
		return reponseData.message;
	}
}