import jwt from '@fastify/jwt'

export default async function (fastify) {
	await fastify.register(jwt, { secret: 'duckdev' });
}