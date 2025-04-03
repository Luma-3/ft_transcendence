
export const getUser = async (req, rep) => {
	const fastify = req.fastify;
	const userModel = req.fastify.userModel;
	const { userId } = req.params;
	
	const user = req.user.payload;
	if (user.id == userId) {
		
		try {
			const db_user = await userModel.findByID(userId);
			if (! db_user) {
				return rep.code(404).send({message: "user ID not found"});
			}
			return rep.code(200).send({data: db_user});
		}
		catch (err) {
			throw Error("Error on retrieve User", { cause: err });
		}	
	}
	return rep.code(401).send({message: "Unauthorized"})
}


export const login = async (req, rep) => {
	const fastify = req.fastify;
	const userModel = req.fastify.userModel;
	
	const {username, password} = req.body;

	try {

		const user = await userModel.findByUsername(username, ['id', 'username', 'password']);
		if (! user) {
			return rep.code(401).send({message: "Login or password incorrect"})
		}

		const isMatch = fastify.bcrypt.compare(password, user.password);
		if (!isMatch) {
			return rep.code(401).send({})
		}

		const payload = {
			id : user.id,
			username: user.username,
			iat: Date.now()
		}
		const token = fastify.jwt.sign({payload});

		return rep.code(200).send({token});

	}
	catch (err) {
		throw Error("Error on Login", { cause: err });
	}
}


export const register = async (req, rep) => {
	const fastify = req.server;
	const userModel = req.server.userModel;

	const {username, password} = req.body;

	let hash_pass = await fastify.bcrypt.hash(password);

	// try {
		const [id] = await userModel.insert(username, hash_pass);

		let altSignOptions = Object.assign({}, fastify.jwt.options.sign)
		altSignOptions.iss = '127.0.0.1:3000'
		altSignOptions.expiresIn = '1d'
		const payload = {
			id : id,
			username: username,
		}
		const token = fastify.jwt.sign({payload}, altSignOptions);
		return rep.code(201).send({data: {token, id}});

	// }
	// catch (err) {
	// 	throw Error("Error on Register", { cause: err });
	// }
}