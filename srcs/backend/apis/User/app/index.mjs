import Fastify from 'fastify'
import cors from '@fastify/cors'
import knex from '../plugins/Knex.mjs'
import config_knex from '../config/knex.config.mjs'

const fastify = Fastify({
	logger: true
});

fastify.register(cors, {
	origin: '*'
});

fastify.register(knex, config_knex);


fastify.get('/api/user', async function(request, reply) {
	console.log('GET /api/user');
	const users = fastify.models.user.getAllUsers()
	return reply.send(users);
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0'})
		console.log(`Server listening on ${fastify.server.address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()