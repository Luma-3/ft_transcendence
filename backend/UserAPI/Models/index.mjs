import { UserModel } from "./UserModel.mjs";

export default function (fastify) {
	fastify.decorate('userModel', new UserModel(fastify.knex))
}