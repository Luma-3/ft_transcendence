import * as UserController from "../Controllers/UserController.mjs";

export default async function UserRoutes(fastify) {
	fastify.post('/register', {	
		schema: {
			description: 'create a new User',
			body : {$ref: 'registerValidationSchema'},
			response: {
				201: { allOf: [
					{ $ref: 'BaseSchema' },
					{	properties: {
						data: { $ref: 'UserSchema' },
					}}
				]}
			}
		}
	},  UserController.register);

	fastify.post('/login', {
		schema : {
			description: 'login a User',
			body: {$ref: 'loginValidationSchema'},
			response: {
				200: { allOf: [
					{ $ref: 'BaseSchema' },
					{	properties: { data: { $ref: 'UserSchema' }, }}
				]}
			}
		}
	}, UserController.login);
	
	fastify.get('/info/:userId', {onRequest: [fastify.authenticate]}, UserController.getUser);
}