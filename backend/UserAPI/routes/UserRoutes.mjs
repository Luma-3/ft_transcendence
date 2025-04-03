import * as UserController from "../Controllers/UserController.mjs";
import { NewUserSchema, LoginUserSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {
	fastify.post('/register', {schema: NewUserSchema},  UserController.register);

	fastify.post('/login',{schema: LoginUserSchema}, UserController.login);
	
	fastify.get('/info/:userId', {onRequest: [fastify.authenticate]}, UserController.getUser);
}