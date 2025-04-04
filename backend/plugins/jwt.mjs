import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: 'duckdev' });

	await fastify.decorate('authenticate', async function(req, rep) {
		try {
			const token = req.cookies.csrftoken
			console.log(req.cookies);
			req.data = await fastify.jwt.verify(token);
		}
		catch (error) {
			console.log(error);
			rep.code(error.statusCode).send({message: error.message, details: error})
		}
	});
}