import * as BlockedServices from '../controllers/blockedController.js'

export async function blockedRoute(fastify) {
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