import Fastify from 'fastify'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const fastify = Fastify({
	logger: true,
	https: {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	},
});

const start = async () => {
	try {
		await fastify.listen({port: 3002, host: '0.0.0.0'});
		console.log(`Server listen on ${fastify.server.address().port}`);
	} catch (error) {
		console.error(err);
		process.exit(1);
	}
}

start();