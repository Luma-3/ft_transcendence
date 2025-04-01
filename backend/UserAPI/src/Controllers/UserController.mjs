import { createError } from "../utils/errors.mjs";


function getUser(fastify, userModel) {
	return async (request, reply) => {
		const { userId } = request.params;

		const user = request.user.payload;
		if (user.id == userId) {

			try {
				const db_user = await userModel.findByID(userId);
				if (! db_user) {
					return reply.code(404).send(createError("user ID not found"));
				}
				return reply.code(200).send({data: db_user});
			}
			catch (err) {
				throw Error("Error on retrieve User", { cause: err });
			}	
		}
		return reply.code(401).send({message: "Unauthorized"})
	}
}


function login(fastify, userModel) {
	return async (request, reply) => {
		const {username, password} = request.body;
		try {

			const user = await userModel.findByUsername(username, ['id', 'username', 'password']);
			if (! user) {
				return reply.code(401).send(createError("Login or password incorrect"))
			}

			const isMatch = fastify.bcrypt.compare(password, user.password);
			if (!isMatch) {
				return reply.code(401).send({})
			}

			const payload = {
				id : user.id,
				username: user.username,
				iat: Date.now()
			}
			const token = fastify.jwt.sign({payload});

			return reply.code(200).send({token});

		}
		catch (err) {
			throw Error("Error on Login", { cause: err });
		}
	}
}


function add(fastify, userModel) {
	return async (request, reply) => {
		const {username, password} = request.body;
		
		let hash_pass = await fastify.bcrypt.hash(password);
		fastify.log.error(hash_pass);

		try {
			const [id] = await userModel.insert(username, hash_pass);

			let altSignOptions = Object.assign({}, fastify.jwt.options.sign)
			altSignOptions.iss = '127.0.0.1:3000'
			altSignOptions.expiresIn = '1d'
			const payload = {
				id : id,
				username: username,
			}
			const token = fastify.jwt.sign({payload}, altSignOptions);
			return reply.code(201).send({token});

		}
		catch (err) {
			throw Error("Error on Register", { cause: err });
		}
	}
}

export default {
	add,
	login,
	getUser
};