import { FastifyInstance } from 'fastify';
import * as PeopleController from '../controllers/peopleController'

export async function peopleRoute(fastify: FastifyInstance) {
	fastify.get("/all/self",  { }, 
	PeopleController.getSelf
	 );
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