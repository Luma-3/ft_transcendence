import UserController from "../Controllers/UserController.mjs";
import { NewUserSchema, LoginUserSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {
	fastify.get('/users', UserController.getAllUser(fastify, fastify.models.user));
	fastify.post('/user/new', {schema: NewUserSchema} ,UserController.addUser(fastify, fastify.models.user));
	fastify.post('/user/login', {schema: LoginUserSchema} ,UserController.loginUser(fastify, fastify.models.user));
}