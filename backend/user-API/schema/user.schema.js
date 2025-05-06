export const userCreateValidation = {
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
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'string' },
    pp_url: { type: 'string' }
  }
}

export const userInfoPrivate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'string' },
    email: { type: 'string' },
    pp_url: { type: 'string' },
    lang: { type: 'string' },
    theme: { type: 'string' }
  }
}

export async function userSchemas(fastify) {
  fastify.addSchema({ $id: 'userCreateValidation', ...userCreateValidation });
  fastify.addSchema({ $id: 'userInfoPublic', ...userInfoPublic });
  fastify.addSchema({ $id: 'userInfoPrivate', ...userInfoPrivate });
}
