import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import { sendEmailBody, verifyCodeBody } from "./2fa.schema";
import { send2FACode, verifyCode } from "./2fa.service";

import { UnauthorizedResponse, NotFoundResponse } from '@transcenduck/error';

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
		await send2FACode(email, '0', lang);
		rep.code(200).send({ message: 'OK' });
	})

	fastify.post('/2faVerify', {
		schema: {
			summary: 'Verify code send in email',
			description: 'Endpoint to verify code send by front for 2 Factor Authentification',
			tags: ['2FA'],
			body: verifyCodeBody,
			response: {
				200: { message: String },
				401: UnauthorizedResponse,
				404: NotFoundResponse
			}
		}
	}, async (req, rep) => {
		await verifyCode(req.body.code);
		return rep.code(200).send({ message: 'OK' });
	})
}

export default route;