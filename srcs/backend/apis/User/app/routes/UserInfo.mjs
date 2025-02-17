import UserController from "../Controllers/UserController.mjs";

export default async function UserRoutes(fastify) {
	fastify.get('/user', UserController.getAllUser);
}