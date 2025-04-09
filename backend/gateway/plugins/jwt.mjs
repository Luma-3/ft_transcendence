import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: process.env.JWT_SECRET });

	fastify.addHook('onRequest', async function (req, rep) {
		if (req.url.startsWith('/user/register') || req.url.startsWith('/user/login') || req.url.startsWith('/doc'))
			return;

		try {
			if (req.cookies.token) {
				req.user = await fastify.jwt.verify(req.cookies.token);
				req.headers['x-user-id'] = req.user.id;
				req.headers['x-user-username'] = req.user.username;
			}
			else  {
				rep.code(401).send({message: "Authentication Token not found"})
			}
		}
		catch (error) {
			console.log(error);
			rep.code(error.statusCode).send({message: error.message, details: error})
		}
	})
}