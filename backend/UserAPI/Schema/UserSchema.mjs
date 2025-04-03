export const registerValidationSchema = {
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: { type: 'string', minLength: 2, maxLength: 32},
			password: { type: 'string', minLength: 8, maxLength: 255},
		}
	}
}

export const loginValidationSchema = {
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: { type: 'string', minLength: 2, maxLength: 32},
			password: { type: 'string', minLength: 8, maxLength: 255}
		}
	}
}

export 	({

	properties: {
		id: { type: 'integer' },
		name: { type: 'string' },
		email: { type: 'string' },
	}
});