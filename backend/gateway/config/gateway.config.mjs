import cookie from "../plugins/cookie.mjs";
import cors from "../plugins/cors.mjs";
import jwt from "../plugins/jwt.mjs"
import swagger from "../plugins/swagger.mjs";
import dotenv from 'dotenv';

export default {
	async registersPlugins(app) {

		dotenv.config()

		await cookie(app)
		await cors(app);
		await jwt(app);
		
		await swagger(app, {
			title: 'APIs Documentation',
			description: 'doc'
		})
	}	
};