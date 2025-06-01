export const sessionCreateValidation = {
  $id: 'sessionCreateValidation',
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['username', 'password'],
  additionalProperties: false,
}

export async function sessionSchemas(fastify) {
  fastify.addSchemaFormater(sessionCreateValidation);
}
