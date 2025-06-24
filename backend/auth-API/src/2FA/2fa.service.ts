import { SendMailOptions } from 'nodemailer'
import { transporter } from '../utils/mail';
import { redisPub } from '../utils/redis';

async function loadLang(language:string ){
	const trad = (await fetch(`./languages/${language}.json`));
	return trad.json();
}

export async function send2FACode(email: string, code: string, language: string) {
	const trad = await loadLang(language);
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
	if (!email) throw NotFoundError("Token not found or expired");

	const codeRedis = await redisPub.get("users.check.email." + email);
	if (token !== tokenRedis) {
    await redisPub.del("users.check.token." + token);
    throw new Unauthorized("Token not found or expired");
  }
	await redisPub.del("users.check.code" + code);
  await redisPub.del("users.check.email" + email);
}