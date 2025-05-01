import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import gateway_config from './config/gateway.config.mjs'
import swaggerUi from "./plugins/swaggerUi.mjs"
import fs from 'fs'
import dotenv from 'dotenv'
import {InternalRoute} from './middleware/InternalRoute.mjs'

dotenv.config()

const gateway = Fastify({
	logger : true,
	https: {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	},
});

await gateway_config.registersPlugins(gateway);

const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : '';

const Services = [
	{
		name: 'Users Services', prefix: dev_prefix + '/user',
		upstream: process.env.NODE_ENV === 'development' ? 'https://localhost:3001' : 'https://user_api:3001',
		url: 'https://localhost:3000' + dev_prefix + '/user/doc/json',
    preHandler: InternalRoute
	},
	{
		name: 'Upload Services', prefix: dev_prefix + '/upload',
		upstream: process.env.NODE_ENV === 'development' ? 'https://localhost:3002' : 'https://upload_api:3002',
		url: 'https://localhost:3000' + dev_prefix + '/upload/doc/json',
    preHandler: InternalRoute
	}
]


await swaggerUi(gateway, Services)

Services.forEach((value) => {
  console.log(value);
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
