import swagger from '@fastify/swagger'

export default async function (fastify, options) {
	await fastify.register(swagger, {
		swagger: {
			info: {
				title: options.title || 'API',
				description: options.description || 'description',
				version: '0.1.0'
			},
			servers: options?.servers || [],
			components: {
				schemas: {
					
				}
			}
		}
	});

	fastify.addSchema({
		$id: 'BaseSchema',
		type: 'object',
		properties: {
			status: {type: 'string', enum: ['success', 'error'] },
			message: {type: 'string'},
		}
	})

	if (options.route !== undefined) {
		fastify.get(options.route, async (_, rep) => {
			console.log('swagger');
			rep.send(fastify.swagger());
		})
	}
}