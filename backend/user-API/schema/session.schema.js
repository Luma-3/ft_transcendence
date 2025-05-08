export const sessionCreateValidation = {
  $id: 'sessionCreateValidation',
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['username', 'password']
}

export async function sessionSchemas(fastify) {
  fastify.addSchemaFormater(sessionCreateValidation);
}
