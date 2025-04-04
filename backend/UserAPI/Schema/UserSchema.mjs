export const registerValidationSchema = {
	type: 'object',
	required: ['username', 'password'],
	properties: {
		username: { type: 'string', minLength: 2, maxLength: 32},
		password: { type: 'string', minLength: 8, maxLength: 255},
	}
};

export const loginValidationSchema = {
	type: 'object',
	required: ['username', 'password'],
	properties: {
		username: { type: 'string', minLength: 2, maxLength: 32},
		password: { type: 'string', minLength: 8, maxLength: 255}
	}
};

export const userSchema= {
	type: 'object',
	properties: {
		id: { type: 'integer' },
		name: { type: 'string' },
		created_at: {type: 'string'}
	}
};

export async function registerUserSchemas(fastify) {
	fastify.addSchema({$id: 'UserSchema', ...userSchema});
	fastify.addSchema({$id: 'loginValidationSchema', ...loginValidationSchema});
	fastify.addSchema({$id: 'registerValidationSchema', ...registerValidationSchema});
}