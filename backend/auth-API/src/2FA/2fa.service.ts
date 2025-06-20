import { SendMailOptions } from 'nodemailer'
import { transporter } from '../utils/mail';

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
}
