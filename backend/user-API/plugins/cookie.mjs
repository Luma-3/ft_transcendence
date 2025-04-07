import cookie from '@fastify/cookie'

export default async function (fastify) {
	await fastify.register(cookie, {});
}