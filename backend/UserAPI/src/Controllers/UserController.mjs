function getAllUser(fastify) {
	return async (request, reply) => {
		try {
			const users = await fastify.models.user.findAll()
			console.log(users)
			return reply.send(users)
		}
		catch (err) {
			return reply.send(err);
		}
	}
}

export default {
	getAllUser
};