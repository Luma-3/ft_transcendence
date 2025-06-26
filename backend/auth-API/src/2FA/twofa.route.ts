import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import { sendEmailBody, ValidationEmailQueryGet } from "./twofa.schema.js";
import { twoFaService } from "./twofa.service.js";
import { ResponseSchema } from "../utils/schema.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.post('/internal/2fa/sendCode', {
		schema: {
			summary: 'Send e-mail code',
			description: 'Endpoint to send an e-mail with a temporary code for 2 Factor Authentification.',
			tags: ['2FA'],
			body: sendEmailBody,
			response: {
				200: ResponseSchema()
			}
		}
	}, async(req, rep) => {
		const { email, lang } = req.body;
		await twoFaService.generateSendCode(email, lang);
		rep.code(200).send({ message: 'OK' });
	});

	fastify.post('/internal/2fa/sendVerifEmail', {
		schema: {
			summary: 'Send e-mail verification',
			description: 'Endpoint to send an e-mail to verify the user e-mail',
			tags: ['2FA'],
			body: sendEmailBody,
			response: {
				200: ResponseSchema()
			}
		}
	}, async (req, rep) => {
		const { email, lang } = req.body;
		await twoFaService.generateSendToken(email, lang);
		rep.code(200).send({ message: 'OK' });
	})

	fastify.get('/2fa/verifyEmail/:token', {
    schema: {
      summary: 'Verfiy e-mail user',
      description: 'Endpoint to verify a user email',
      tags: ['Users'],
      params: ValidationEmailQueryGet,
      response: {
        200: ResponseSchema()
      }
    }
  }, async (req, rep) => {
    await twoFaService.verifyEmail(req.params.token)
    return rep.code(200).send({ message: 'Email verified successfully' });
  });
}

export default route;