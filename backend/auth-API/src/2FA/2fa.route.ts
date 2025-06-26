import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import { sendEmailBody } from "./2fa.schema.js";
import { send2FACode } from "./2fa.service.js";

import crypto from 'crypto';

export function generateCode(): string {
  const code = crypto.randomInt(0, 1000000);
  return code.toString().padStart(6, '0');
}

const route: FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.post('/internal/sendCode', {
		schema: {
			summary: 'Send e-mail code',
			description: 'Endpoint to send an e-mail with a temporary code for 2 Factor Authentification.',
			tags: ['2FA'],
			body: sendEmailBody,
			response: {
				200: { message: String }
			}
		}
	}, async(req, rep) => {
		const { email, lang } = req.body;
		await send2FACode(email, generateCode(), lang);
		rep.code(200).send({ message: 'OK' });
	})
}

export default route;