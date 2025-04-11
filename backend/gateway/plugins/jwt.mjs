import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: process.env.JWT_SECRET });

	fastify.addHook('onRequest', async function (req, rep) {
		console.log(req.url);
		const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : '' 
		if (
			req.url.startsWith(dev_prefix + '/user/register') ||
			req.url.startsWith(dev_prefix + '/user/login')		||
			req.url.startsWith(dev_prefix + '/user/oauth')		||
			req.url.startsWith('/doc')
		) {
			return;

		}

		try {
			console.log("TOKEN :", req.cookies.token);
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