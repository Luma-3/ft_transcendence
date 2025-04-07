import jwt from '@fastify/jwt'

export default async function (fastify) {
	console.log(process.env.JWT_SECRET);
	await fastify.register(jwt, { secret: process.env.JWT_SECRET });

	await fastify.decorate('authenticate', async function(req, rep) {
		try {
			req.data = await fastify.jwt.verify(req.cookies.token);
		}
		catch (error) {
			console.log(error);
			rep.code(error.statusCode).send({message: error.message, details: error})
		}
	});
}