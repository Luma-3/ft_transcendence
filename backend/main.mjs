import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import common_config from './config/fastify_commun.config.mjs'
import gateway_config from './config/gateway.config.mjs'
import axios from 'axios';

const gateway = Fastify(common_config);

await gateway_config.registersPlugins(gateway);

gateway.register(http_proxy, {
	upstream: 'http://localhost:3001',
	prefix: '/api/user'
})

// gateway.get('/docs/json', async (_, rep) => {
// 	// try {
// 		const services = [
// 			{name: "users", url: 'http://localhost:3001/doc/json'}
// 		];

// 		const schemas = await Promise.all(
// 			services.map(async (services) => {
// 				const res = await axios.get(services.url);
// 				return {[services.name]: res.data};
// 			}) 
// 		);

// 		const aggregatedDocs = {
// 			swagger: {
// 				info: {
// 					title: 'API Gateway Docs',
// 					description: 'All doc\'s Services of transcenduck',
// 					version: '0.0.1'
// 				},
// 			}
// 		};

// 		schemas.forEach((schema) => {
// 			const key = Object.keys(schema)[0];
// 			const doc = schema[key];

// 			Object.keys(doc.paths).forEach((route) => {
// 				aggregatedDocs.paths[`/${key}`] = doc.paths[route];
// 			});
// 		});


// 		rep.send(aggregatedDocs);
// 	// }
// 	// catch (err) {
// 	// 	throw Error('Aggregate Docs fail', {cause: err});
// 	// }
// });


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
