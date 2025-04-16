import Fastify from 'fastify'
import fs from 'fs'
import dotenv from 'dotenv'
import fastifyMultipart from '@fastify/multipart'
import uplaodRoute from './handler/Routes.mjs'
import swagger from './plugins/swagger.mjs'

dotenv.config()

const fastify = Fastify({
	logger: true,
	https: {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	},
});

fastify.register(fastifyMultipart);
await swagger(fastify, {
	title: 'Upload Service API',
	description: 'Endpoints for uplaod files',
	route: '/doc/json'
});

fastify.register(uplaodRoute);

const start = async () => {
	try {
		await fastify.listen({port: 3002, host: '0.0.0.0'});
		console.log(`Server listen on ${fastify.server.address().port}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

start();