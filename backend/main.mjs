import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';

const gateway = Fastify();


gateway.register(cors, {
    origin: '*'
}); // TODO Only for dev


gateway.register(http_proxy, {
	upstream: 'http://localhost:3001',
	prefix: '/api/user'
})

const start = async () => {
	try {
		await gateway.listen({ port: 3000, host: '0.0.0.0'})
		console.log(`Gateway listening on ${gateway.server.address().port}`)
	} catch (err) {
		gateway.log.error(err)
		process.exit(1)
	}
};

start();
