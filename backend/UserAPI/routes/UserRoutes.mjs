import UserController from "../Controllers/UserController.mjs";
import { NewUserSchema, LoginUserSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {

	fastify.post('/new', {schema: NewUserSchema} ,UserController.add(fastify, fastify.models.user));
	fastify.post('/login',{schema: LoginUserSchema}, UserController.login(fastify, fastify.models.user));
	
	fastify.get('/:userId', UserController.getUser(fastify, fastify.models.user))
}