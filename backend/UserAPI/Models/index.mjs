import UserModel from "./UserModel.mjs";

export default function (fastify) {
	fastify.decorate('models', {
		user: new UserModel(fastify.knex)
	})
}