
export const getUser = async (req, rep) => {
	const fastify = req.server;
	const userModel = req.server.userModel;
	const { userId } = req.params;
	
	const user = req.data;
	if (user.id != userId) {
		return rep.code(401).send({message: "Unauthorized"})
	}

	const [db_user] = await userModel.findByID(userId);

	if (!db_user) {
		return rep.code(404).send({message: "user ID not found"});
	}
	return rep.code(200).send({data: db_user});
}


export const login = async (req, rep) => {
	const fastify = req.server;
	const userModel = req.server.userModel;
	
	// TODO: redirect if Token JWT is Ok

	const {username, password} = req.body;
	const [user] = await userModel.findByUsername(username, ['id', 'username', 'password']);
	if (! user) {
		return rep.code(401).send({message: "Login or password incorrect"})
	}

	const isMatch = fastify.bcrypt.compare(password, user.password);
	if (!isMatch) {
		return rep.code(401).send({message: "Login or password incorrect"})
	}
	const token = fastify.jwt.sign({payload});

	return rep.code(200).setCookie("token", token, {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE,
		sameSite: process.env.NODE_ENV === "production" ? "none": undefined,
		path: "/",
		maxAge: 60 * 60 * 24, // 1 jour
	}).send({data: user});
}


export const register = async (req, rep) => {
	const fastify = req.server;
	const userModel = req.server.userModel;

	// TODO: redirect if Token JWT is Ok

	const {username, password} = req.body;
	if (userModel.findByUsername(username) === null) {
		return rep.code(403).send({message: 'User Already Exist'})
	}

	let hash_pass = await fastify.bcrypt.hash(password);

	const [newUsername] = await userModel.insert(username, hash_pass);

	let altSignOptions = Object.assign({}, fastify.jwt.options.sign)
	altSignOptions.iss = '127.0.0.1:3000'
	altSignOptions.expiresIn = '1d'

	const token = fastify.jwt.sign(newUsername, altSignOptions);
	
	return rep.code(201).setCookie("token", token, {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE,
		sameSite: process.env.NODE_ENV === "production" ? "none": undefined,
		path: "/",
		maxAge: 60 * 60 * 24, // 1 jour
	}).send({data: newUsername});
}