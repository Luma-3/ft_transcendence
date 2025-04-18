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

export const publicUserSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		created_at: {type: 'string'}
	}
};

export const privateUserSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		email: { type: 'string' },
		created_at: {type: 'string'}
	}
}

export async function registerUserSchemas(fastify) {
	fastify.addSchema({$id: 'publicUserSchema', ...publicUserSchema});
	fastify.addSchema({$id: 'privateUserSchema', ...privateUserSchema});
	fastify.addSchema({$id: 'loginValidationSchema', ...loginValidationSchema});
	fastify.addSchema({$id: 'registerValidationSchema', ...registerValidationSchema});
}