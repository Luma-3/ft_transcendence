import fp from 'fastify-plugin'
import Knex from 'knex'

function knexPlugin(fastify, options, done) {
	if (!fastify.knex) {
		const knex = Knex(options[process.env.NODE_ENV || 'development']);
		fastify.decorate('knex', knex);

		fastify.addHook('onClose', (fastify, done) => {
			if (fastify.knex === knex) {
				fastify.knex.destroy(done);
			}
		})
	}
	done();
}

export default fp(knexPlugin, {name: 'fastify-knex'})
