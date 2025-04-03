import knex from '../../plugins/knex.mjs'
import bcrypt from 'fastify-bcrypt'
import knex_config from './knex.config.mjs'
import swagger from '../../plugins/swagger.mjs';


export default {
	async registerPlugins(fastify) {

		await fastify.register(knex, knex_config)

		await fastify.register(bcrypt, { saltWorkFactor: 12 })

		await swagger(fastify, {
			title: 'User Service API',
			description: 'Endpoints for user management',
			route: '/doc/json'
		})
	}
};

