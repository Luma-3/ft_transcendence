import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import gateway_config from './config/gateway.config.mjs'

const gateway = Fastify({
	logger : true,
});

await gateway_config.registersPlugins(gateway);

gateway.register(http_proxy, {
	upstream: 'http://user_api:3001',
	prefix: '/user'
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
