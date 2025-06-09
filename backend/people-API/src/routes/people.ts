import { FastifyInstance } from 'fastify';
import * as PeopleController from '../controllers/peopleController'
import {  GatewayHeader, PeoplesResponsePublic, SearchGet } from '../schema/people.schema';
import { ResponseSchema } from '../utils/schema';
import { Type } from '@sinclair/typebox';

export async function peopleRoute(fastify: FastifyInstance) {
	fastify.get("/all/self",  
		{
			schema: {
				headers: GatewayHeader
			}
		 }, 
	PeopleController.getSelf);
	fastify.get("/all", 
	{
		
			schema: {
				headers: GatewayHeader
			}
	},
	 PeopleController.getAll
	);
	fastify.get("/", 
	{
		schema: {
			querystring: SearchGet,
			headers: GatewayHeader,
			response: {
				200: ResponseSchema(Type.Array(PeoplesResponsePublic))
			}
		}
	},
	 PeopleController.search
	);
}