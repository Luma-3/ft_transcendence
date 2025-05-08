export const userCreateValidation = {
  $id: 'userCreateValidation',
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 2, maxLength: 32 },
    email: { type: 'string', format: 'email' },
    password: {
      type: 'string',
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
      minLength: 8,
      maxLength: 255
    },
    preferences: { $ref: 'preferencesPrivate' }
  },
  required: ['username', 'password', 'email'],
}

export const userInfoPublic = {
  $id: 'userInfoPublic',
  description: 'Public information of a user',
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'string' },
    preferences: { $ref: 'preferencesPublic', db: false }
  }
}

export const userInfoPrivate = {
  $id: 'userInfoPrivate',
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'string' },
    email: { type: 'string' },
    preferences: { $ref: 'preferencesPrivate', db: false }
  }
}

export async function userSchemas(fastify) {
  fastify.addSchemaFormater(userCreateValidation);
  fastify.addSchemaFormater(userInfoPublic);
  fastify.addSchemaFormater(userInfoPrivate);
}
