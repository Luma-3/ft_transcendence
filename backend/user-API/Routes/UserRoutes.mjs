import * as UserController from "../Controllers/UserController.mjs";

export default async function UserRoutes(fastify) {
	fastify.post('/register', {	
		schema: {
			description: 'create a new User',
			body : {$ref: 'registerValidationSchema'},
			response: {
				201: {}
			}
		}
	},  UserController.register);

	fastify.post('/login', {
		schema : {
			description: 'login a User',
			body: {$ref: 'loginValidationSchema'},
			response: {
				200: {}
			}
		}
	}, UserController.login);
	
	fastify.get('/public/:userId', {
		schema: {
			description: 'Get Public Info of a User',
			response: {
				200: { allOf: [
					{ $ref: 'BaseSchema'},
					{ properties: { data: { $ref: 'publicUserSchema'}}}
				]}
			}
		}
	}, UserController.getUser);

	fastify.get('/me', {
		schema : {
			description: 'Get Private Info of a User',
			response: {
				200: { allOf: [
					{ $ref: 'BaseSchema'},
					{ properties: { data: { $ref: 'privateUserSchema'}}}
				]}
			}
		}
	}, UserController.privateInfoUser)
}