import Fastify from 'fastify'
import common_config from '../config/fastify_commun.config.mjs'
import config from './config/fastify.config.mjs'
import errorHandler from '../middlewares/errorHandler.mjs'
import formatJSON from '../middlewares/formatJSON.mjs'
import UserRoutes from './Routes/UserRoutes.mjs'

import { UserModel } from './Models/UserModel.mjs'
import { registerUserSchemas } from './Schema/UserSchema.mjs'

const fastify = Fastify(common_config.fastifyOptions);

await common_config.registerPlugins(fastify);
await config.registerPlugins(fastify);

fastify.setErrorHandler(errorHandler)
fastify.addHook("preSerialization", formatJSON)

fastify.decorate('userModel', (new UserModel(fastify.knex)))
await registerUserSchemas(fastify);
fastify.register(UserRoutes);

const start = async () => {
	try {
		await fastify.listen({ port: 3001, host: '0.0.0.0'})
		console.log(`Server listening on ${fastify.server.address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()