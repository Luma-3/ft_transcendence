import crypto from 'crypto';
import fs from 'fs';

import { transporter } from '../utils/mail.js';
import { redisPub } from '../utils/redis.js';
import { SendMailOptions } from 'nodemailer'
import { randomUUID } from 'crypto';
import fetch from 'node-fetch'

import { NotFoundError, UnauthorizedError, ConflictError } from '@transcenduck/error';

import verifyEmail from './public/html/verifyEmail.js';

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
		html: verifyEmail(trad, process.env.URL, data)
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
		html: `
			<body 
				style="
					text-align: center;
					color: white;
					background-image: url('cid:backgroundImg');
					background-repeat: no-repeat;
					margin: auto;
				"
			>
				<div
					style="
						font-family: 'cid:chillax', sans-serif;
						padding: 40px 30px;
						border-radius: 12px;
						text-shadow: 0 1px 3px rgba(0,0,0,0.6);
					"
					@media screen and (min-width: 500px) {
						width: 100%;
					}
				>
					<div
						style="
							text-align: center;
							margin-bottom: 30px;
						"
					>
						<img
							src="cid:logo"
							alt="Logo"
							style="width: 50%;"
							@media screen and (min-width: 500px) {
								width: 80%;
							}
						>
					</div>

					<p
						style="
							font-size: 16px;
							margin-bottom: 20px;
							text-align: center;
						"
					>
						${trad['verificationIntro']} <strong>${trad['verificationCode']}</strong> :
					</p>

					<div
						style="
							margin: 30px 0;
							text-align: center;
						"
					>
						<span
							style="
								display: inline-block;
								padding: 20px 40px;
								background-color: #22c55e;
								border-radius: 12px;
								font-size: 28px;
								font-weight: bold;
								letter-spacing: 4px;
								color: white;
								box-shadow: 0 4px 6px rgba(0,0,0,0.3);
							"
						>
							${code}
						</span>
					</div>

					<p
						style="
							font-size: 14px;
							margin-bottom: 10px;
							text-align: center;
						"
					>
						${trad['codeValadity']}
					</p>

					<p
						style="
							font-size: 14px;
							margin-bottom: 30px;
							text-align: center;
						"
					>
						${trad['ignoreWarning']}
					</p>

					<div
						style="
							background-color: black;
							padding: 4px;
							text-align: center;
							border-radius: 15px;
							max-width: 50%;
							margin: auto;
							text: bold;
						"
					>
						<b>
							<p
								style="
									font-size: 14px;
									margin-bottom: 10px;
									text-align: center;
								"
							>
								${trad['automaticMessage']}
								${trad['dontRespond']}
							</p>
						</b>
					</div>

					<div
						style="
							text-align: center;
							max-width: 500px;
							margin: auto;
						"
					>
						<img
							src="cid:duckHappy"
							alt="LogoTranscenduck-Footer"
							style="width: 50%;"
						>
					</div>

					<p
						style="
							font-size: 14px;
							margin: 0;
						"
					>
						${trad['signature']}
					</p>
				</div>
			</body>
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

		const multi = redisPub.multi();		
		await send2FACode(email, code, lang);
		await multi.setEx("users:check:code:" + code, 600, email);
		await multi.setEx("users:check:email:" + email, 600, code);

		multi.exec().catch(console.error);
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

		const redis2faUpdate = await redisPub.get("users:2fa:update:" + email);
		redisPub.del("users:2fa:update:" + email);

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