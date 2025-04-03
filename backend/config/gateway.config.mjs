import swagger from "../plugins/swagger.mjs";
import swaggerUi from "../plugins/swaggerUi.mjs"

export default {
	async registersPlugins(app) {
		await swagger(app, {
			title: 'APIs Documentation',
			description: 'doc'
		})
		await swaggerUi(app);
	}	
};