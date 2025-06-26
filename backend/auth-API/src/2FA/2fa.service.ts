import { SendMailOptions } from 'nodemailer'
import { transporter } from '../utils/mail.js';
import { redisPub } from '../utils/redis.js';

import { NotFoundError, UnauthorizedError } from '@transcenduck/error';
import fs from 'fs';

async function loadLang(language: string){
  const trad = JSON.parse(fs.readFileSync(`./src/2FA/languages/${language}.json`, 'utf8'));
	return trad;
}

export async function send2FACode(email: string, code: string, language?: string) {
	const trad = await loadLang(language ?? 'en');
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_2FA']} ${code}`,
		html: `
			<p>${trad['greeting']},</p>
			<p>${trad['VerificationIntro']} <strong>${trad['verificationCode']}</strong> :</p>
			<h2>${code}</h2>
			<p>${trad['codeValidity']}</p>
			<p>${trad['ignoreWarning']}</p>
			<p>${trad['signature']}</p>
		`
	}
	await transporter.sendMail(mailOptions);
	await redisPub.setEx("users.check.code." + code, 600, email);
	await redisPub.setEx("users.check.email." + email, 600, code);
}

export async function verifyCode(code: string) {
	const email = await redisPub.get("users.check.code." + code);
	if (!email) throw new NotFoundError("Code not found or expired");

	const codeRedis = await redisPub.get("users.check.email." + email);
	if (code !== codeRedis) {
    await redisPub.del("users.check.code." + code);
    throw new UnauthorizedError("Code not found or expired");
  }
	await redisPub.del("users.check.code" + code);
  await redisPub.del("users.check.email" + email);
}