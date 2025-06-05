import { FastifyInstance } from 'fastify';
import * as BlockedServices from '../controllers/blockedController'

export async function blockedRoute(fastify: FastifyInstance) {
	fastify.post("/blocked/:blockedId", 
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					blockedId: { type: 'string' }
				},
				required: ['blockedId']
			}
		}
	},
	 BlockedServices.blockUser
	);
	fastify.delete("/blocked/:blockedId", 
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					blockedId: { type: 'string' }
				},
				required: ['blockedId']
			}
		}
	},
	 BlockedServices.unBlockUser
	);
}