import knex from '../../plugins/knex.mjs'
import bcrypt from 'fastify-bcrypt'
import knex_config from './knex.config.mjs'


export default {
	async registerPlugins(fastify) {

		await fastify.register(knex, knex_config)

		await fastify.register(bcrypt, { saltWorkFactor: 12 })
	}
};

