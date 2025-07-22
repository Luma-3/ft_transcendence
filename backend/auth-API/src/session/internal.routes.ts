import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { ResponseSchema } from "../utils/schema.js";
import { UserId } from "./schema.js";

import { SessionService } from "./service.js";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.delete('/internal/session/:userId', {
		schema: {
			summary: 'Delete current user session',
			description: 'This endpoint allows users to delete their current session.',
			tags: ['Sessions'],
			params: UserId,
			response: {
				200: ResponseSchema(undefined, 'Session deleted successfully')
			}
		}
	}, async (req, rep) => {
		const userID = req.params.userId;
		await SessionService.deleteById(userID);
		rep.code(200).send({ message: 'Session deleted successfully' })
	});
}

export default route;