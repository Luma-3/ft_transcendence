import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: 'duckdev' });

	await fastify.decorate('authenticate', async function(request, reply) {
		try {
			await request.jwtVerify();
		}
		catch (error) {
			reply.code(error.statusCode).send({message: error.message, details: error})
		}
	});
}