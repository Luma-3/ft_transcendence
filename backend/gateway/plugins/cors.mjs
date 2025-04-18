import cors from '@fastify/cors'

export default async function (fastify) {
	await fastify.register(cors, { 
		origin: 'https://localhost:5173',
		credentials: true,
	});
}