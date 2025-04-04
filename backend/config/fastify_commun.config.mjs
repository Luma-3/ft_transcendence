import jwt from "../plugins/jwt.mjs";
import cors from "../plugins/cors.mjs";
import cookie from "../plugins/cookie.mjs";

export default {
	fastifyOptions : {
		logger : true,
	},

	async registerPlugins(fastify) {
		await cors(fastify);
		await jwt(fastify);
		await cookie(fastify)
	}
};