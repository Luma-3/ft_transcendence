import * as PeopleController from '../controllers/peopleController.js'

export async function peopleRoute(fastify) {
	fastify.get("/all/self",  { }, () => {} );
	fastify.get("/all", 
	{
		schema: {

		}
	},
	 PeopleController.getAll
	);
	fastify.get("/", 
	{
		schema: {
			querystring: {
				type: 'object',
				properties: {
					search: { type: 'string' }
				},
				required: ['search']
			}
		}
	},
	 PeopleController.search
	);
}