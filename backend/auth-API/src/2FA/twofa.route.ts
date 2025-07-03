import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import { CodeValidationBody, sendEmailBody, UserPublicResponse, ValidationEmailQueryGet } from "./twofa.schema.js";
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
		console.log(`Requete recu, email : ${email}, lang : ${lang};`)
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
				200: ResponseSchema(UserPublicResponse, 'e-mail verified succefully and user definitivelly created'),
			}
		}
	}, async (req, rep) => {
		const { email, lang, token } = req.body;
		await twoFaService.generateSendToken(email, lang, token);
		rep.code(200).send({ message: 'OK' });
	})

	fastify.post('/2fa/resendVerifEmail', {
		schema: {
			summary: 'Resend e-mail verification',
			description: 'Endpoint to resend an e-mail to verify the user e-mail',
			tags: ['2FA'],
			body: sendEmailBody,
			response: {
				200: ResponseSchema()
			}
		}
	}, async (req, rep) => {
		const { email, lang } = req.body;
		await twoFaService.resendEmail(email, lang);
		rep.code(200).send({ message: 'OK' });
	})

	fastify.get('/2fa/email/:token', {
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

	fastify.post('/2fa/code', {
		schema: {
      summary: 'Verfiy code 2fa',
      description: 'Endpoint to verify code send on e-mail for 2fa',
      tags: ['Users'],
      body: CodeValidationBody,
      response: {
        200: ResponseSchema()
      }
    }
	}, async (req, rep) => {
		const message = await twoFaService.verifyCode(req.body.code);
		return rep.code(200).send({ message: message })
	})
}

export default route;