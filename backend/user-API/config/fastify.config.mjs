import knex from '../plugins/knex.mjs'
import bcrypt from 'fastify-bcrypt'
import knex_config from './knex.config.mjs'
import swagger from '../plugins/swagger.mjs';
import cookie from '../plugins/cookie.mjs';
import jwt from '../plugins/jwt.mjs';
import dotenv from 'dotenv';
import google from '../plugins/google.mjs'

export default {
	async registerPlugins(fastify) {

		dotenv.config()

		// await cors(fastify)

		await fastify.register(knex, knex_config)

		await fastify.register(bcrypt, { saltWorkFactor: 12 })
		await cookie(fastify);
		await jwt(fastify);
		await google(fastify);

		await swagger(fastify, {
			title: 'User Service API',
			description: 'Endpoints for user management',
			route: '/doc/json'
		})
	}
};

