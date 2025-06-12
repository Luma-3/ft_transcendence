import { FastifyInstance } from 'fastify';
import * as BlockedServices from '../controllers/blockedController.js'
import { InternalServerErrorResponse, UnauthorizedResponse } from '@transcenduck/error';
import { ResponseSchema } from '../utils/schema.js';
import { BlockedParam } from '../schema/people.schema.js';

export async function blockedRoute(fastify: FastifyInstance) {
	fastify.post("/blocked/:blockedId", 
	{
		schema: {
			params: BlockedParam,
			response: {
				200: ResponseSchema(undefined, "User blocked successfully")
			}
		}
	},
	 BlockedServices.blockUser
	);
	fastify.delete("/blocked/:blockedId", 
	{
		schema: {
			params: BlockedParam,
			response: {
				401: ResponseSchema(UnauthorizedResponse, "user not is blocked or you are blocked by user", "error"),
				500: ResponseSchema(InternalServerErrorResponse, undefined, "error")
			}
		}
	},
	 BlockedServices.unBlockUser
	);
}