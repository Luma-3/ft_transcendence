export const registerValidationSchema = {
	type: 'object',
	required: ['username', 'password', 'email'],
	properties: {
		username: { type: 'string', minLength: 2, maxLength: 32},
		password: { type: 'string', minLength: 8, maxLength: 255},
    email: {type: 'string', format: 'email'},
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

export const preferencesValidationSchema = {
  type: 'object',
  properties: {
    theme:  { type: 'string', enum: ['dark', 'light']},
    lang:   { type : 'string', minLength: 2, maxLength: 2},
  },
  additionalProperties: false,
  minProperties: 1
}

export const changePasswordValidationSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  properties: {
    oldPassword: {type : 'string', minLength: 8, maxLength: 255},
    newPassword: {type : 'string', minLength: 8, maxLength: 255}
  }
}

export const changeEmailValidationSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email : {type: 'string', format: 'email'}
  }
}

export const changeProfilePicValidationSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary'
    }
  }
}

export const publicUserSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		created_at: {type: 'string'},
    pp_url: {type: 'string'}
	}
};

export const privateUserSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		created_at: {type: 'string'},
		email: {type: 'string'},
    pp_url: {type: 'string'},
    lang: {type: 'string'},
    theme: {type: 'string'}
  }
}

export async function registerUserSchemas(fastify) {
	fastify.addSchema({$id: 'publicUserSchema', ...publicUserSchema});
	fastify.addSchema({$id: 'privateUserSchema', ...privateUserSchema});
	fastify.addSchema({$id: 'loginValidationSchema', ...loginValidationSchema});
	fastify.addSchema({$id: 'registerValidationSchema', ...registerValidationSchema});
  fastify.addSchema({$id: 'preferencesValidationSchema', ...preferencesValidationSchema});
  fastify.addSchema({$id: 'changePasswordValidationSchema', ...changePasswordValidationSchema});
  fastify.addSchema({$id: 'changeEmailValidationSchema', ...changeEmailValidationSchema});
  fastify.addSchema({$id: 'changeProfilePicValidationSchema', ...changeProfilePicValidationSchema});
}
