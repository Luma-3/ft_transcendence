import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { 
		secret: process.env.JWT_SECRET,
		sign: {
			iss: process.env.GATEWAY_IP,
			expiresIn: '1d',
		}
	});

	fastify.addHook('onRequest', async function (req, rep) {
		const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : ''
    console.log(req.url);
		if (
			req.url.startsWith(dev_prefix + '/user/register') ||
			req.url.startsWith(dev_prefix + '/user/login')		||
			req.url.startsWith(dev_prefix + '/user/oauth')		||
			req.url.startsWith('/doc')												||
			req.url.endsWith('/doc/json')
		) {
			return;
		}

		const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
		if (!token) {
			return rep.code(401).send({message: "Token is required"});
		}

		try {
			req.user = await fastify.jwt.verify(token);
			req.headers['x-user-id'] = req.user.id;
			req.headers['x-user-username'] = req.user.username;
		}
		catch (error) {
			req.log.error(error);
			rep.code(401).send({
				message: "Invalid or expired token",
				details: error.message,
			})
		}
	})
}
