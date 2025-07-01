import crypto from 'crypto';
import fs from 'fs';

import { transporter } from '../utils/mail.js';
import { redisPub } from '../utils/redis.js';
import { SendMailOptions } from 'nodemailer'
import { randomUUID } from 'crypto';
import fetch from 'node-fetch'

import { NotFoundError, UnauthorizedError, ConflictError } from '@transcenduck/error';

async function loadLang(language: string){
  const trad = JSON.parse(fs.readFileSync(`./src/2FA/languages/${language}.json`, 'utf8'));
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
		html: `
			<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 40px 30px; border-radius: 12px; background: url('YOUR_BACKGROUND_IMAGE_URL') no-repeat center / cover; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
				<div style="text-align: center; margin-bottom: 30px;">
					<img src="https://via.placeholder.com/150x100?text=Logo" alt="Logo" style="max-width: 100px;">
				</div>

				<p style="font-size: 20px; margin-bottom: 15px;">${trad['greeting']},</p>

				<p style="font-size: 16px; margin-bottom: 20px;">
					${trad['verificationIntro']} <strong>${trad['verificationLink']}</strong> :
				</p>

				<div style="margin: 30px 0; text-align: center;">
					<a href="${process.env.URL}/verifyEmail?value=${data}"
						style="display: inline-block; padding: 14px 28px; background-color: #9333ea; border-radius: 8px; color: white; text-decoration: none; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
						${trad['verifyButton']}
					</a>
				</div>

				<p style="font-size: 14px; margin-bottom: 10px;">${trad['linkValidity']}</p>
				<p style="font-size: 14px; margin-bottom: 30px;">${trad['ignoreWarning']}</p>

				<p style="font-size: 14px;">${trad['signature']}</p>

				<div style="text-align: center; margin-top: 30px;">
					<img src="https://via.placeholder.com/300x100?text=Merci+!" alt="${trad['footerImageAlt'] ?? 'Footer'}" style="max-width: 100%;">
				</div>
			</div>
		`
	}
	await transporter.sendMail(mailOptions);
}

async function send2FACode(email: string, code: string, language?: string) {
	const trad = await loadLang(language ?? 'en');
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_2FA']}`,
		html: `
			<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 40px 30px; border-radius: 12px; background: url('YOUR_BACKGROUND_IMAGE_URL') no-repeat center / cover; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
				<div style="text-align: center; margin-bottom: 30px;">
					<img src="https://via.placeholder.com/150x100?text=Logo" alt="Logo" style="max-width: 100px;">
				</div>

				<p style="font-size: 20px; margin-bottom: 15px;">${trad['greeting']},</p>

				<p style="font-size: 16px; margin-bottom: 20px;">
					${trad['verificationIntro']} <strong>${trad['verificationCode']}</strong> :
				</p>

				<div style="margin: 30px 0; text-align: center;">
					<span style="display: inline-block; padding: 20px 40px; background-color: #22c55e; border-radius: 12px; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
						${code}
					</span>
				</div>

				<p style="font-size: 14px; margin-bottom: 10px;">${trad['codeValadity']}</p>
				<p style="font-size: 14px; margin-bottom: 30px;">${trad['ignoreWarning']}</p>

				<p style="font-size: 14px;">${trad['signature']}</p>

				<div style="text-align: center; margin-top: 30px;">
					<img src="https://via.placeholder.com/300x100?text=Merci+!" alt="${trad['footerImageAlt'] ?? 'Footer'}" style="max-width: 100%;">
				</div>
			</div>
		`
	}
	await transporter.sendMail(mailOptions);
}

export class twoFaService {
	static async generateSendToken(email: string, lang: string, token?: string) {
		if (!token)
			token = randomUUID();
		await sendVerificationEmail(email, token, lang);
		await redisPub.setEx("users:check:token:" + token, 600, email);
		await redisPub.setEx("users:check:email:" + email, 600, token);
	}

	static async generateSendCode(email: string, lang: string, code?: string) {
		if (!code)
			code = generateCode();
		await send2FACode(email, code, lang);
		await redisPub.setEx("users:check:code:" + code, 600, email);
		await redisPub.setEx("users:check:email:" + email, 600, code);
	}

	static async resendEmail(email: string, lang: string) {
		const token = await redisPub.get("user:check:email" + email);
		if (token) {
			throw new ConflictError('Email already sent and not expired');
		}
		this.generateSendToken(email, lang);
	}

	static async verifyEmail(token: string) {
		const email = await redisPub.get("users:check:token:" + token);
		if (!email) throw new NotFoundError("Token not found or expired");
		const tokenRedis = await redisPub.get("users:check:email:" + email);
		if (token !== tokenRedis) {
			await redisPub.del("users:check:token:" + token);
			throw new ConflictError("Token not found or expired");
		}

		await fetch(`http://${process.env.USER_IP}/internal/createUser`, {
			method: 'POST',
			headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
			body: JSON.stringify({ userID: token })
		})

		const multi = redisPub.multi();
		multi.del("users:check:token:" + token);
		multi.del("users:check:email:" + email);
		multi.exec().catch(console.error);
		await fetch(`http://${process.env.USER_IP}/users/internal/activeAccount/${email}`, {
			method: 'PATCH'
		})
	}

	static async verifyCode(code: string) {
		const email = await redisPub.get("users:check:code:" + code);
		if (!email) throw new NotFoundError("Code not found or expired");

		const codeRedis = await redisPub.get("users:check:email:" + email);
		if (code !== codeRedis) {
			await redisPub.del("users:check:code:" + code);
			throw new UnauthorizedError("Code not found or expired");
		}
		await redisPub.del("users:check:code:" + code);
		await redisPub.del("users:check:email:" + email);
	}
}