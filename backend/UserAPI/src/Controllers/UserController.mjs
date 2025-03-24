

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

function loginUser(fastify, userModel) {
	return async (request, reply) => {
		const {username, password} = request.body;
		try {
			const user = await userModel.findByUsername(username);
			fastify.log.error("User: " + user);
			if (user) {
				const isMatch = fastify.bcrypt.compare(password, user.password);
				if (isMatch) {
					return reply.send({id: user.id, username: user.username, email: user.email});
				}
			}
			return reply.code(401).send();
		}
		catch (err) {
			return reply.code(500).send({err: 'Erreur lors de la connexion'});
		}	
	}
}


function addUser(fastify, userModel) {
	return async (request, reply) => {
		const {username, password, email} = request.body;
		
		let hash_pass = await fastify.bcrypt.hash(password);
		fastify.log.error(hash_pass);

		try {
			const [id] = await userModel.insert(username, hash_pass, email);
			reply.code(201).send({id, username, email});
		}
		catch (err) {
			reply.code(500).send({ err: 'Erreur lors de l\'insertion' });
		}
	}
}

export default {
	getAllUser,
	addUser,
	loginUser
};