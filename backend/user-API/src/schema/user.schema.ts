import { Type, Static } from '@sinclair/typebox';

import { PreferencesBase, PreferencesPublicResponse, PreferencesPrivateResponse, PreferencesUpdateBody } from './preferences.schema';


export const UserBase = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String({ minLength: 2, maxLength: 32 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({
    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
    minLength: 8,
    maxLength: 255
  }),
  created_at: Type.String({ format: 'date-time' }),
  preferences: Type.Optional(PreferencesBase)
});

export const UserPublicResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
  preferences: Type.Optional(PreferencesPublicResponse)
});

export const UserPrivateResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
  email: Type.String({ format: 'email' }),
  preferences: Type.Optional(PreferencesPrivateResponse)
});

export const UserCreateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 32 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({
    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
    minLength: 8,
    maxLength: 255
  }),
  preferences: Type.Optional(PreferencesUpdateBody)
}, {
  additionalProperties: false
});

export const UserPasswordUpdateBody = Type.Object({
  oldPassword: Type.String(),
  password: Type.String({
    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
    minLength: 8,
    maxLength: 255
  })
});

export const UserEmailUpdateBody = Type.Object({
  email: Type.String({ format: 'email' })
});

export const UserUsernameUpdateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 32 })
});

export const UserParamGet = Type.Object({
  id: Type.String({ format: 'uuid' })
});

export const UserQueryGet = Type.Object({
  includePreferences: Type.Optional(Type.Boolean())
}, {
  additionalProperties: false
});

export type UserPublicResponseType = Static<typeof UserPublicResponse>;
export type UserPrivateResponseType = Static<typeof UserPrivateResponse>;

export type UserCreateBodyType = Static<typeof UserCreateBody>;

export type UserPasswordUpdateBodyType = Static<typeof UserPasswordUpdateBody>;
export type UserEmailUpdateBodyType = Static<typeof UserEmailUpdateBody>;
export type UserUsernameUpdateBodyType = Static<typeof UserUsernameUpdateBody>;

export type UserParamGetType = Static<typeof UserParamGet>;
export type UserQueryGetType = Static<typeof UserQueryGet>;
