import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import common_config from './config/fastify_commun.config.mjs'
import gateway_config from './config/gateway.config.mjs'

const gateway = Fastify(common_config);

await gateway_config.registersPlugins(gateway);

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
