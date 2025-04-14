import Fastify from 'fastify'
import config from './config/fastify.config.mjs'
import errorHandler from './middlewares/errorHandler.mjs'
import formatJSON from './middlewares/formatJSON.mjs'
import Routes from './handler/Routes.mjs'
import fs from 'fs'
import dotenv from 'dotenv'

import { UserModel } from './handler/Model.mjs'
import { registerUserSchemas } from './handler/Schema.mjs'

dotenv.config()

const fastify = Fastify({
	logger : true,
	https: {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	},
});

await config.registerPlugins(fastify);

fastify.setErrorHandler(errorHandler)
fastify.addHook("preSerialization", formatJSON)

fastify.decorate('userModel', (new UserModel(fastify.knex)))
await registerUserSchemas(fastify);
fastify.register(Routes);

const start = async () => {
	try {
		await fastify.listen({ port: 3001, host: '0.0.0.0'})
		console.log(`Server listening on ${fastify.server.address().port}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

start()