import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { InternalServerErrorResponse } from "@transcenduck/error";

import { UserHeaderAuthentication } from "../users/schema.js";
import { ResponseSchema } from "../utils/schema.js";

import { twofaStatus } from "./schema.js";
import { twofaService } from "./service.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.get('/users/2fa', {
    schema: {
      summary: 'Get 2fa infos for a user',
      description: 'Endpoint to get the 2 Factor Authentification informations',
      tags: ['Users','2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(twofaStatus, 'Ok')
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    const twoFaStatus = await twofaService.get2faStatus(userId);
    return rep.code(200).send({ message: 'Ok', data: twoFaStatus });
  });

  fastify.put('/users/2fa', {
    schema: {
      summary: 'Start enable 2fa for a user',
      description: 'Endpoint to start enablation of 2 Factor Authentification',
      tags: ['Users','2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(),
        500: InternalServerErrorResponse
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    await twofaService.enable2FA(userId);
    return rep.code(200).send({ message: "waiting for validation" });
  });

  fastify.delete('/users/2fa', {
    schema: {
      summary: 'Start disable 2fa for a user',
      description: 'Endpoint to start disablation of 2 Factor Authentification',
      tags: ['Users','2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(),
        500: InternalServerErrorResponse
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    await twofaService.disable2FA(userId);
    return rep.code(200).send({ message: "waiting for validation" });
  });
}

export default route;