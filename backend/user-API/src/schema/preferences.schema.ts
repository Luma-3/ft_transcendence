import { Type, Static } from '@sinclair/typebox'

export const PreferencesBase = Type.Object({
  theme: Type.Optional(Type.Union([Type.Literal('dark'), Type.Literal('light')])),
  lang: Type.Optional(Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')])),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
});

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

export const PreferencesGetType = Type.Object({
  userID: Type.String({ format: 'uuid' }),
});

export const PreferencesPublicResponse = Type.Object({
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
});

export const PreferencesPrivateResponse = Type.Object({
  theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
});


export type PreferencesBaseType = Static<typeof PreferencesBase>;

export type PreferencesUpdateBodyType = Static<typeof PreferencesUpdateBody>;
export type PreferencesGetType = Static<typeof PreferencesGetType>;

export type PreferencesPublicResponseType = Static<typeof PreferencesPublicResponse>;
export type PreferencesPrivateResponseType = Static<typeof PreferencesPrivateResponse>;

