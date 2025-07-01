import { Type, Static } from '@sinclair/typebox'

export const PreferencesBase = Type.Object({
  user_id: Type.String({ format: 'uuid' }),
  theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
  banner: Type.String({ format: 'uri' })
});
export type PreferencesBaseType = Static<typeof PreferencesBase>;

export const PreferencesUpdateBody = Type.Object(
  {
    theme: Type.Optional(Type.Union([Type.Literal('dark'), Type.Literal('light')])),
    lang: Type.Optional(Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')])),
    avatar: Type.Optional(Type.String({ format: 'uri' })),
  },
  {
    additionalProperties: false,
    minProperties: 1
  }
);
export type PreferencesUpdateBodyType = Static<typeof PreferencesUpdateBody>;

export const PreferencesGetType = Type.Object({
  user_id: Type.String({ format: 'uuid' }),
});
export type PreferencesGetType = Static<typeof PreferencesGetType>;

export const PreferencesPublicResponse = Type.Object({
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
  banner: Type.String({ format: 'uri' })
});
export type PreferencesPublicResponseType = Static<typeof PreferencesPublicResponse>;

export const PreferencesPrivateResponse = Type.Object({
  theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
	banner: Type.String({ format: 'uri' })
});
export type PreferencesPrivateResponseType = Static<typeof PreferencesPrivateResponse>;
