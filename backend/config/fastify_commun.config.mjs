import jwt from "../plugins/jwt.mjs";
import cors from "../plugins/cors.mjs";
import cookie from "../plugins/cookie.mjs";
import dotenv from "dotenv"

const __dirname = import.meta.dirname;

export default {
	fastifyOptions : {
		logger : true,
	},

	async registerPlugins(fastify) {		
		dotenv.config({ path: __dirname + "/../.env"})

		await cors(fastify);
		await jwt(fastify);
		await cookie(fastify)
	}
};