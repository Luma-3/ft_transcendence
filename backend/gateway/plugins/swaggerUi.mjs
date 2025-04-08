import swagger_ui from '@fastify/swagger-ui'

export default async function (fastify, servers) {
	await fastify.register(swagger_ui, {
		routePrefix: '/doc',
		uiConfig: {
			displayRequestDuration: true,
			docExpansion: 'none',
			filter: true,
			urls: servers
		},
		transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
	})
}