import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import { ResponseSchema } from "../utils/schema.js";

import { CodeValidationBody, sendEmailBody, ValidationEmailQueryGet, } from "./schema.js";
import { twoFaService } from "./service.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/2fa/code', {
    schema: {
      summary: 'Verify 2FA code',
      description: 'Verify the 2FA code sent by email.',
      tags: ['2FA'],
      body: CodeValidationBody,
      response: {
        200: ResponseSchema()
      },
    }
  }, async (req, rep) => {
    const message = await twoFaService.verifyCode(req.body.code);
    rep.code(200).send({ message });
  });
  
  fastify.get('/2fa/email/:token', {
    schema: {
      summary: 'Verify email by token',
      description: 'Verify user email using a token (clicked from email).',
      tags: ['2FA', 'Email'],
      params: ValidationEmailQueryGet,
      response: {
        200: ResponseSchema()
			},
    }
  }, async (req, rep) => {
    await twoFaService.verifyEmail(req.params.token);
    rep.code(200).send({ message: 'Email verified successfully' });
  });

  fastify.patch('/2fa/email', {
    schema: {
      summary: 'Resend verification email',
      description: 'Resend the email verification to user.',
      tags: ['2FA', 'Email'],
      body: sendEmailBody,
      response: {
        200: ResponseSchema()
      },
    }
  }, async (req, rep) => {
    const { email, lang } = req.body;
    await twoFaService.resendEmail(email, lang);
    rep.code(200).send({ message: 'Verification email resent' });
  });
};

export default route;