export const userCreateValidation = {
  $id: 'userCreateValidation',
  type: 'object',
  required: ['username', 'password', 'email'],
  properties: {
    username: { type: 'string', minLength: 2, maxLength: 32 },
    password: {
      type: 'string',
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
      minLength: 8,
      maxLength: 255
    },
    email: { type: 'string', format: 'email' },
    preferences: { // TODO: 
      type: 'object',
      lang: { type: 'string', minLength: 2, maxLength: 2 }
    }
  }
}

export const userInfoPublic = {
  $id: 'userInfoPublic',
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'string' },
    pp_url: { type: 'string' }
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
    pp_url: { type: 'string' },
    lang: { type: 'string', minLength: 2, maxLenght: 2, examples: ['en', 'fr'] },
    theme: { type: 'string', enum: ['dark', 'light'] }
  }
}

export async function userSchemas(fastify) {
  fastify.addSchema(userCreateValidation);
  fastify.addSchema(userInfoPublic);
  fastify.addSchema(userInfoPrivate);
}
