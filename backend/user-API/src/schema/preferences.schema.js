export const preferencesPrivate = {
  $id: 'preferencesPrivate',
  type: 'object',
  properties: {
    theme: { type: 'string', enum: ['dark', 'light'] },
    lang: { type: 'string', enum: ['en', 'fr', 'es'] },
    avatar: { type: 'string', format: 'uri' },
    banner: { type: 'string', format: 'uri' },
  }
}

export const preferencesPublic = {
  $id: 'preferencesPublic',
  type: 'object',
  properties: {
    lang: { type: 'string', enum: ['en', 'fr', 'es'] },
    avatar: { type: 'string', format: 'uri' },
    banner: { type: 'string', format: 'uri' },
  }
}


export const preferencesAvatarPrivate = {
  $id: 'preferencesAvatarPublic',
  type: 'object',
  properties: {
    avatar: { type: 'string', format: 'uri' },
  }
}


export const preferencesBannerPrivate = {
  $id: 'preferencesBannerPrivate',
  type: 'object',
  properties: {
    banner: { type: 'string', format: 'uri' },
  }
}

export const preferencesValidation = {
  $id: 'preferencesValidation',
  minProperties: 1,
  type: 'object',
  properties: {
    theme: { type: 'string', enum: ['dark', 'light'] },
    lang: { type: 'string', enum: ['en', 'fr', 'es'] },
    avatar: { type: 'string', format: 'uri' },
  },
  additionalProperties: false,
}

export async function preferencesSchema(fastify) {
  fastify.addSchemaFormater(preferencesPrivate);
  fastify.addSchemaFormater(preferencesPublic);
  fastify.addSchemaFormater(preferencesValidation);
}
