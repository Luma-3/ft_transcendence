import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import gateway_config from './config/gateway.config.mjs'
import swaggerUi from "./plugins/swaggerUi.mjs"


const gateway = Fastify({
	logger : true,
});

await gateway_config.registersPlugins(gateway);

const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : '';

const Services = [
	{
		name: 'Users Services', prefix: dev_prefix + '/user',
		upstream: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://user_api:3001',
		url: 'http://localhost:3000' + dev_prefix + '/user/doc/json'
	}
]

// Services.forEach((value) => {
// 	value['url'] = value.upstream + '/doc/json';
// });

console.log(Services);

await swaggerUi(gateway, Services)

Services.forEach((value) => {
	gateway.register(http_proxy, value);
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
