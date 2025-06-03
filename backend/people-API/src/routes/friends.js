import * as FriendsController from '../controllers/friendsController.js'

export async function friendRoute(fastify) {
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
}