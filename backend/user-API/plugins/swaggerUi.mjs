import swagger_ui from '@fastify/swagger-ui'

export default async function (fastify) {
	await fastify.register(swagger_ui, {
		routePrefix: '/api/doc',
		uiConfig: {
			displayRequestDuration: true,
			docExpansion: 'none',
			filter: true,
			urls: [
				{url: 'http://localhost:3001/doc/json', name: 'Users Services'},
			]
		},
		transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
	})
}