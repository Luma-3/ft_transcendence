import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: 'duckdev' });

	await fastify.decorate('authenticate', async function(request, reply) {
		fastify.log.error("YO");
		try {
			await request.jwtVerify();
		}
		catch (error) {
			reply.code(error.statusCode).send({message: error.message, details: error})
		}
	});
}