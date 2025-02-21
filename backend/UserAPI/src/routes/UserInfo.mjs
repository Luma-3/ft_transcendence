import UserController from "../Controllers/UserController.mjs";
import { UserSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {
	fastify.get('/user', UserController.getAllUser(fastify, fastify.models.user));
	fastify.post('/user', {schema: UserSchema} ,UserController.addUser(fastify, fastify.models.users));
}