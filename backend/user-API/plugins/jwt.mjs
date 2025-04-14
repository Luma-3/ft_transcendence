import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { 
		secret: process.env.JWT_SECRET,
		sign: {
			iss: process.env.GATEWAY_IP,
			expiresIn: '1d',
		}
	});

	await fastify.decorate('authenticate', async function(req, rep) {
		const token = req.cookies.token;
		if (!token) {
			return rep.code(401).send({message: "Token is required"});
		}

		try {
			req.data = await fastify.jwt.verify(token);
		}
		catch (error) {
			rep.code(401).send({
				message: "Invalid or expired token",
				details: error.message,
			})
		}
	});
}