import swagger from '@fastify/swagger'

export default async function (fastify, options) {
	await fastify.register(swagger, {
		swagger: {
			info: {
				title: options.title || 'API',
				description: options.description || 'description',
				version: '0.1.0'
			}
		}
	});

	if (options.route !== undefined) {
		fastify.get(options.route, async (_, rep) => {
			rep.send(fastify.swagger());
		})
	}
}