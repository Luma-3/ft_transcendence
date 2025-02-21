

function getAllUser(fastify, userModel) {
	return async (request, reply) => {
		try {
			const users = await userModel.findAll()
			return reply.send(users)
		}
		catch (err) {
			return reply.send(err);
		}
	}
}


function addUser(fastify, userModel) {
	return async (request, reply) => {
		const {username, email} = request.body;

		try {
			const [id] = await userModel.insert(username, email);
			reply.code(201).send({id, username, email});
		}
		catch (err) {
			fastify.log.error(err);
			reply.code(500).send({ err: 'Erreur lors de l\'insertion' });
		}
	}
}

export default {
	getAllUser,
	addUser
};