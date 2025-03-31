import { replyApi } from "../utils/responseApi.mjs";

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

function decode(fastify, userModel) {
	return async (request, reply) => {
		const user = request.jwt
		fastify.log.info("User: " + user);

  // // We clone the global signing options before modifying them
  // let altSignOptions = Object.assign({}, fastify.jwt.options.sign)
  // altSignOptions.iss = 'another.example.tld'

  // // We generate a token using the default sign options
  // const token = await reply.jwtSign({ foo: 'bar' })
  // // We generate a token using overrided options
  // const tokenAlt = await reply.jwtSign({ foo: 'bar' }, altSignOptions)

// 	let token = request.headers['authorization'];
// 	fastify.log.info("token: " + token);
// 	fastify.log.info("token: KKJEFHKJFHEKJHFKJFHKJEHFKJHFEKJ");

// 	token = token.replace("Bearer ", "");
//   // We decode the token using the default options
//   const decodedToken = fastify.jwt.decode(token)

//   // // We decode the token using completely overided the default options
//   // const decodedTokenAlt = fastify.jwt.decode(tokenAlt, { complete: false })

//   fastify.log.info("decode: " + decodedToken.payload.username);
//   /**
//    * Will return:
//    *
//    * {
//    *   "decodedToken": {
//    *     "header": {
//    *       "alg": "ES256",
//    *       "typ": "JWT"
//    *     },
//    *     "payload": {
//    *       "foo": "bar",
//    *       "iat": 1540305336
//    *       "iss": "api.example.tld"
//    *     },
//    *     "signature": "gVf5bzROYB4nPgQC0nbJTWCiJ3Ya51cyuP-N50cidYo"
//    *   },
//    * }
//    */
}}

function loginUser(fastify, userModel) {
	return async (request, reply) => {
		const {username, password} = request.body;
		try {
			const user = await userModel.findByUsername(username);
			if (user) {
				const isMatch = fastify.bcrypt.compare(password, user.password);
				if (isMatch) {
					const payload = {
						id : user.id,
						username: user.username,
						iat: Date.now()
					}
					const token = fastify.jwt.sign({payload});
					return new replyApi().sendData(reply, 200, {token});
				}
			}
			return new replyApi().sendError(reply, 401, {status: 401, message:"Login or password incorrect"});
		}
		catch (err) {
			return new replyApi().sendError(reply, 500, {status: 500, message:"Erreur lors de la connexion"});
		}	
	}
}


function addUser(fastify, userModel) {
	return async (request, reply) => {
		const {username, password} = request.body;
		
		let hash_pass = await fastify.bcrypt.hash(password);
		fastify.log.error(hash_pass);

		try {
			const [id] = await userModel.insert(username, hash_pass);

			let altSignOptions = Object.assign({}, fastify.jwt.options.sign)
			altSignOptions.iss = '127.0.0.1:3000'
			const payload = {
				id : id,
				username: username,
			}
			const token = fastify.jwt.sign({payload}, altSignOptions);
			return new replyApi().sendData(reply, 201, {token});

		}
		catch (err) {
			return new replyApi().sendError(reply, 500, {status: 500, message: "insertion Error"});
		}
	}
}

export default {
	getAllUser,
	addUser,
	loginUser,
	decode
};