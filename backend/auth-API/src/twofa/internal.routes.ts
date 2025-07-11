import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import {
	sendEmailBody,
	UserPublicResponse,
} from "./schema.js";
import { TwoFaService } from "./service.js";
import { ResponseSchema } from "../utils/schema.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {

	// ==================== ROUTE: Send 2FA Code (Internal) ====================
	fastify.post('/internal/2fa/code', {
		schema: {
			summary: 'Send 2FA code (internal)',
			description: 'Send an email with a 2FA code (for internal usage).',
			tags: ['2FA', 'Internal'],
			body: sendEmailBody,
			response: { 
				200: ResponseSchema()
			},
		}
	}, async (req, rep) => {
		const { email, lang } = req.body;
		await TwoFaService.generateSendCode(email, lang);
		rep.code(200).send({ message: '2FA code sent (internal)' });
	});

	// ==================== ROUTE: Send Email Verification (Internal) ====================
	fastify.post('/internal/2fa/email', {
		schema: {
			summary: 'Send email verification (internal)',
			description: 'Send email verification after user pre-creation (internal call).',
			tags: ['2FA', 'Email', 'Internal'],
			body: sendEmailBody,
			response: {
				200: ResponseSchema(UserPublicResponse, 'Email verified and user created'),
			},
		}
	}, async (req, rep) => {
		const { email, lang, token } = req.body;
		await TwoFaService.generateSendToken(email, lang, token);
		rep.code(200).send({ message: 'Verification email sent (internal)' });
	});
}

export default route; 