export const preferencesPrivate = {
  $id: 'preferencesPrivate',
  type: 'object',
  properties: {
    theme: { type: 'string', enum: ['dark', 'light'] },
    lang: { type: 'string', enum: ['en', 'fr', 'es'] },
    avatar: { type: 'string', format: 'uri' },
  }
}

export const preferencesPublic = {
  $id: 'preferencesPublic',
  type: 'object',
  properties: {
    lang: { type: 'string', enum: ['en', 'fr', 'es'] },
    avatar: { type: 'string', format: 'uri' },
  }
}

export async function preferencesSchema(fastify) {
  fastify.addSchemaFormater(preferencesPrivate);
  fastify.addSchemaFormater(preferencesPublic);
}
