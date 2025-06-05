import { FastifyInstance } from 'fastify';
import * as FriendsController from '../controllers/friendsController'

export async function friendRoute(fastify: FastifyInstance) {
	fastify.post("/friends/:friendId", 
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					friendId: { type: 'string' }
				},
				required: ['friendId']
			}
		}
	},
	 FriendsController.addFriend
	);
	fastify.delete("/friends/:friendId", 
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					friendId: { type: 'string' }
				},
				required: ['friendId']
			}
		}
	},
	 FriendsController.removeFriend
	);
	fastify.delete("/pending/:friendId", 
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					friendId: { type: 'string' }
				},
				required: ['friendId']
			}
		}
	},
	 FriendsController.refuseFriend
	);
}