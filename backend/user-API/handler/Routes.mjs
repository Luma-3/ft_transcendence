import * as Controller from "./Controller.mjs";

export default async function UserRoutes(fastify) {
	fastify.post('/register', {	
		schema: {
			description: 'create a new User',
			body : {$ref: 'registerValidationSchema'},
			response: {
				201: {}
			}
		}
	},  Controller.register);

	fastify.post('/login', {
		schema : {
			description: 'login a User',
			body: {$ref: 'loginValidationSchema'},
			response: {
				200: {}
			}
		}
	}, Controller.login);
	
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
	}, Controller.getUser);

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
	}, Controller.privateInfoUser)

	fastify.get('/oauth',{schema: {hide: true}}, Controller.oauthCallback);


	fastify.get('/logout', {
		schema : {
			description: 'logout a User',
			response: {
				200: {
					$ref: 'BaseSchema'
				}
			}
		}
	}, Controller.logout);

  fastify.get('/login/dev', {}, Controller.dev_login);

  fastify.patch('/preferances', {
  schema: {
      description: 'Update preferances setting of user',
      body: {$ref: 'preferancesValidationSchema'},
      response: {
        200: { allOf: [
          { $ref: 'BaseSchema' },
          { properties: { data: { $ref: 'privateUserSchema'}}}
        ]}
      }
    } }, Controller.changePreferances);
}
