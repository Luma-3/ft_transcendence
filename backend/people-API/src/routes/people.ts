import { FastifyInstance } from 'fastify';
import * as PeopleController from '../controllers/peopleController.js'
import {  GatewayHeader, PeoplesResponsePublic, SearchGet } from '../schema/people.schema.js';
import { ResponseSchema } from '../utils/schema.js';
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