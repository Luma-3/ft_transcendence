import Fastify from 'fastify'
import common_config from '../config/fastify_commun.config.mjs'
import config from './config/fastify.config.mjs'
import errorHandler from '../middlewares/errorHandler.mjs'
import formatJSON from '../middlewares/formatJSON.mjs'
import routes from './routes/index.mjs'
import Models from './Models/index.mjs'

// import swagger_ui from '@fastify/swagger-ui'
// import swagger from '@fastify/swagger'


const fastify = Fastify(common_config.fastifyOptions);

await common_config.registerPlugins(fastify);
await config.registerPlugins(fastify);

fastify.setErrorHandler(errorHandler)
fastify.addHook("preSerialization", formatJSON)

Models(fastify);

routes(fastify)


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