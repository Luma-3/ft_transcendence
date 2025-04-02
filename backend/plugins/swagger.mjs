import swagger from '@fastify/swagger'
import swagger_ui from '@fastify/swagger-ui'

export default async function (fastify, options) {
	await fastify.register(swagger, {
		swagger: {
			swagger: '2.0',
			info: {
				title: options.title || 'API',
				description: options.description || 'API Documentation',
				version: '0.0.1',
			},
			host: 'localhost',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
		},
		exposeRoute: true
	});
	await fastify.register(swagger_ui, {
		routePrefix: '/doc',
		swagger: '2.0',
		// uiConfig:{
		// 	docExpansion: 'full',
		// 	deepLinking: false
		// },
		// uiHooks: {
		// 	onRequest: function (request, reply, next) { next() },
		// 	preHandler: function (request, reply, next) { next() }
		// },
		staticCSP: true,
		transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
	})
}