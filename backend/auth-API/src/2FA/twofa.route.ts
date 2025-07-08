import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import {
  CodeValidationBody,
  sendEmailBody,
  UserPublicResponse,
  ValidationEmailQueryGet,
} from "./twofa.schema.js";
import { twoFaService } from "./twofa.service.js";
import { ResponseSchema } from "../utils/schema.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  // ========= 🔒 ROUTES INTERNES (entre services) =========

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
    await twoFaService.generateSendCode(email, lang);
    rep.code(200).send({ message: '2FA code sent (internal)' });
  });

  fastify.post('/internal/email-verification', {
    schema: {
      summary: 'Send email verification (internal)',
      description: 'Send email verification after user pre-creation (internal call).',
      tags: ['Email', 'Internal'],
      body: sendEmailBody,
      response: {
        200: ResponseSchema(UserPublicResponse, 'Email verified and user created'),
      },
    }
  }, async (req, rep) => {
    const { email, lang, token } = req.body;
    await twoFaService.generateSendToken(email, lang, token);
    rep.code(200).send({ message: 'Verification email sent (internal)' });
  });

  // ========= 🌐 ROUTES PUBLIQUES (front client) =========

  fastify.post('/2fa/code/verify', {
    schema: {
      summary: 'Verify 2FA code',
      description: 'Verify the 2FA code sent by email.',
      tags: ['2FA'],
      body: CodeValidationBody,
      response: { 200: ResponseSchema() },
    }
  }, async (req, rep) => {
    const message = await twoFaService.verifyCode(req.body.code);
    rep.code(200).send({ message });
  });

  fastify.post('/email-verification/resend', {
    schema: {
      summary: 'Resend verification email',
      description: 'Resend the email verification to user.',
      tags: ['Email'],
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

  fastify.get('/email-verification/:token', {
    schema: {
      summary: 'Verify email by token',
      description: 'Verify user email using a token (clicked from email).',
      tags: ['Email'],
      params: ValidationEmailQueryGet,
      response: {
				200: ResponseSchema()
			},
    }
  }, async (req, rep) => {
    await twoFaService.verifyEmail(req.params.token);
    rep.code(200).send({ message: 'Email verified successfully' });
  });
};

export default route;