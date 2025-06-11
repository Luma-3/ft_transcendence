import { FastifyInstance } from 'fastify';
import * as FriendsController from '../controllers/friendsController.js'
import { FriendsParam } from '../schema/people.schema.js';

export async function friendRoute(fastify: FastifyInstance) {
	fastify.post("/friends/:friendId", 
	{
		schema: {
			params: FriendsParam
		}
	},
	 FriendsController.addFriend
	);
	fastify.delete("/friends/:friendId", 
	{
		schema: {
			params: FriendsParam
		}
	},
	 FriendsController.removeFriend
	);
	fastify.delete("/pending/:friendId", 
	{
		schema: {
			params: FriendsParam
		}
	},
	 FriendsController.refuseFriend
	);
}