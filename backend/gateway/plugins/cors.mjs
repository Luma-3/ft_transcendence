import cors from '@fastify/cors'

export default async function (fastify) {
	await fastify.register(cors, { 
		origin: 'http://localhost:5173',
		credentials: true, 
	});
}