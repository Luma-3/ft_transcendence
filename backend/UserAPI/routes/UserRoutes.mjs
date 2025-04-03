import * as UserController from "../Controllers/UserController.mjs";
import { registerValidationSchema, loginValidationSchema } from "../Models/UserModel.mjs";

export default async function UserRoutes(fastify) {


	fastify.addSchema({
		$id: 'UserSchema',
		type: 'object',
		properties: {
			id: { type: 'integer' },
			name: { type: 'string' },
			email: { type: 'string' },
		}
	});
	
	fastify.post('/register', {	
		schema: {
			description: 'create a new User',
			body: registerValidationSchema.body,
			response: {
				200: { allOf: [
					{ $ref: 'BaseSchema' },
					{	properties: {
						data: { $ref: 'UserSchema' },
						details: { type: 'null' }
					}}
				]}
			}
		}
	},  UserController.register);

	fastify.post('/login',{schema: loginValidationSchema}, UserController.login);
	
	fastify.get('/info/:userId', {onRequest: [fastify.authenticate]}, UserController.getUser);
}