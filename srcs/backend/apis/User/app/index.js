import Fastify from 'fastify'

const fastify = Fastify({
	logger: true
});

fastify.get('/api/user', async function(request, reply) {
	return reply.send({ hello: 'world'});
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