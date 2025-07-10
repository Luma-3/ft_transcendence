import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { headerUserID, twofaStatus } from "./schema.js";
import { ResponseSchema } from "../utils/schema.js";
import { twofaService } from "./service.js";
import { UserActivateAccountParams } from "../users/user.schema.js";

const route : FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.patch('/internal/users/2fa', {
    schema: {
      summary: 'Update 2fa for a user',
      description: 'Endpoint to update the 2 Factor Authentification in the database',
      tags: ['Users', '2FA'],
      body: headerUserID,
      response: {
        200: ResponseSchema()
      }
    }
  }, async(req, rep) => {
    const message = await twofaService.update2FA(req.body.userID);
    return rep.code(200).send({ message: message })
  })

	fastify.patch('/internal/users/:email/account', {
		schema: {
			summary: 'Active account of a user',
			description: 'Endpoint to activate user account after verifying his e-mail',
			tags: ['Users','2FA'],
			params: UserActivateAccountParams,
			response: {
				200: ResponseSchema(twofaStatus, 'Ok')
			}
		}
	}, async (req, rep) => {
		const email = req.params.email;
		await twofaService.activateUserAccount(email);
		return rep.code(200).send({ message: 'Ok' });
	})
}

export default route;