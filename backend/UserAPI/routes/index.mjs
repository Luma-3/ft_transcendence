import UserRoutes from "./UserRoutes.mjs";

export default function (fastify) {
	fastify.register(UserRoutes);

	fastify.addHook("onRequest", async (request, reply) => { // TODO : trouver un moyen plus propre de faire ca ! 
		fastify.log.info(request.url);
		if (request.url !== '/user/new') {
			try {
				await request.jwtVerify();
			}
			catch (error) {
				reply.code(error.statusCode).send({message: error.message, details: error})
			}
		}
	})
}