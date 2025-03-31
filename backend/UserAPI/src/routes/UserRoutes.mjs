import UserController from "../Controllers/UserController.mjs";
import { NewUserSchema, LoginUserSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {
	// fastify.get('/users', UserController.getAllUser(fastify, fastify.models.user));




	fastify.post('/user/new', {schema: NewUserSchema} ,UserController.add(fastify, fastify.models.user));
	fastify.post('/user/login',{schema: LoginUserSchema}, UserController.login(fastify, fastify.models.user));
	
	// fastify.get('/user/logout',UserController.logout(fastify, fastify.models.user))
	fastify.get('/user/:userId', UserController.getUser(fastify, fastify.models.user))
}