import swagger_ui from '@fastify/swagger-ui'

export default async function (fastify) {
	await fastify.register(swagger_ui, {
		routePrefix: '/api/doc',
		exposeRoute: true,
		staticCSP: true,
		transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
	})
}