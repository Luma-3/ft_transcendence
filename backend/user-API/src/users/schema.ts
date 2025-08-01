import { Type, Static } from '@sinclair/typebox';

import {
  PreferencesBase,
  PreferencesPublicResponse,
  PreferencesPrivateResponse,
  PreferencesUpdateBody
} from "../preferences/schema.js";

// Share Field Utilities
// To avoid duplication, we define shared fields for user Utilities


const passwordField = Type.String({
  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/\\-])[A-Za-z\\d@$!%*?&/\\-]{8,}$',
  minLength: 8,
  maxLength: 255
});

const UserSharedFields = {
  id: Type.String({ format: 'uuid' }),
  username: Type.String({ minLength: 2, maxLength: 10 }),
  created_at: Type.String({ format: 'date-time' }),
};

// User Base Schema (Principal Interface for Swagger and TypeScript)

export const UserBase = Type.Object({
  ...UserSharedFields,
  google_id: Type.Optional(Type.String()),
  email: Type.String({ format: 'email' }),
  password: Type.Union([passwordField, Type.Null()]),
  validated: Type.Boolean({
    description: 'Indicates if the user has validated their email address.'
  }),
  twofa: Type.Boolean({
    description: 'Indicates if the user has activated or not 2 Factor Authentification.'
  }),
  preferences: Type.Optional(PreferencesBase)
});
export type UserBaseType = Static<typeof UserBase>;

export const UserDBHydrateType = Type.Object({
  ...UserSharedFields,
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  banner: Type.Optional(Type.String({ format: 'uri' })),
});
export type UserDBHydrateType = Static<typeof UserDBHydrateType>;

export const UserDBBase = Type.Object({
  ...UserSharedFields,
  email: Type.String({ format: 'email' }),
  password: passwordField,
  theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
  avatar: Type.String({ format: 'uri' }),
  banner: Type.String({ format: 'uri' })
});
export type UserDBBaseType = Static<typeof UserDBBase>;

// User Response Schema
// This schema is used for responses, including public and private user data.

export const UserPublicResponse = Type.Object({
  ...UserSharedFields,
  online: Type.Optional(Type.Boolean({ description: 'Indicates if the user is currently online' })),
  preferences: Type.Optional(PreferencesPublicResponse)
});
export type UserPublicResponseType = Static<typeof UserPublicResponse>;

export const UserPrivateResponse = Type.Object({
  ...UserSharedFields,
  email: Type.String({ format: 'email' }),
  validated: Type.Boolean(),
  twofa: Type.Boolean(),
  online: Type.Optional(Type.Boolean({ description: 'Indicates if the user is currently online' })),
  preferences: Type.Optional(PreferencesPrivateResponse)
});
export type UserPrivateResponseType = Static<typeof UserPrivateResponse>;

// User Create and Update Schemas
// These schemas are used for creating and updating user data, including validation for fields like username, email, and password.

export const UserCreateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 10 }),
  email: Type.String({ format: 'email' }),
  password: passwordField,
  preferences: Type.Optional(PreferencesUpdateBody)
}, {
  additionalProperties: false
});
export type UserCreateBodyType = Static<typeof UserCreateBody>;

export const UserCreateBodyInternal = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 10 }),
  email: Type.String({ format: 'email' }),
  googleId: Type.Optional(Type.String({ format: 'uuid' })),
  lang: Type.Optional(Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')], {
    default: 'en',
    description: 'Language preference for the user.'
  })),
}, {
  additionalProperties: false
});
export type UserCreateBodyInternalType = Static<typeof UserCreateBodyInternal>;

export const UserCreateRedis = Type.Object({
  userID: Type.String({ format: 'uuid' })
});

export const UserPasswordUpdateBody = Type.Object({
  oldPassword: Type.Optional(passwordField),
  password: passwordField
});
export type UserPasswordUpdateBodyType = Static<typeof UserPasswordUpdateBody>;

export const UserEmailUpdateBody = Type.Object({
  email: Type.String({ format: 'email' })
});
export type UserEmailUpdateBodyType = Static<typeof UserEmailUpdateBody>;

export const UserUsernameUpdateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 10 })
});
export type UserUsernameUpdateBodyType = Static<typeof UserUsernameUpdateBody>;

// User Parameter and Query Schemas
// These schemas are used for defining parameters and query strings in API endpoints,
// such as fetching a user by ID or including preferences in the response.

export const UserParamGet = Type.Object({
  id: Type.String({ format: 'uuid' })
});
export type UserParamGetType = Static<typeof UserParamGet>;

export const UserQueryGet = Type.Object({
  includePreferences: Type.Optional(Type.Boolean())
}, {
  additionalProperties: false
});
export type UserQueryGetType = Static<typeof UserQueryGet>;

// User Header Schema
// This schema is used for defining headers in API requests, such as passing a user ID in the header.

export const UserHeaderAuthentication = Type.Object({
  'x-user-id': Type.String({ format: 'uuid' }),
}, {
  additionalProperties: true
});

export const UserActivateAccountParams = Type.Object({
  'email': Type.String({ format: 'email' })
});

export const UsersQueryGetAll = Type.Object({
  blocked: Type.Optional(Type.Union([
    Type.Literal('you'),
    Type.Literal('another'),
    Type.Literal('all'),
    Type.Literal('none')
  ], {
    default: 'none',
    description: 'Filter users based on blocking status. "you" for users who blocked you, "another" for users you blocked, "all" for both, and "none" for no filtering.'
  })),
  friends: Type.Optional(Type.Boolean({
    default: false,
    description: 'Include friends in the response. If true, only friends will be returned.'
  })),
  pending: Type.Optional(Type.Boolean({
    default: false,
    description: 'If true, includes pending friend requests in the response.'
  })),
  page: Type.Optional(Type.Number({ description: 'Page number for pagination', default: 1, minimum: 1 })),
  limit: Type.Optional(Type.Number({ description: 'Number of results per page', default: 10, minimum: 1, maximum: 100 })),
  hydrate: Type.Optional(Type.Boolean({
    default: false,
    description: 'If true, includes additional user data such as avatar and banner.'
  }))
}, {
  additionalProperties: false
});

export type UserHeaderIdType = Static<typeof UserHeaderAuthentication>;

// Internal User Schema

export const VerifyCredentials = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 10 }),
  password: Type.String()
}, {
  additionalProperties: false
});
export type VerifyCredentialsType = Static<typeof VerifyCredentials>;

export const User2faInfos = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  validated: Type.Boolean(),
  twofa: Type.Boolean()
});
export type User2faInfosType = Static<typeof User2faInfos>;

export const UserRedis = Type.Object({
  user_obj: Type.Object({
    username: Type.String({ format: 'uuid' }),
    password: Type.String(),
    email: Type.String({ format: 'email' }),
  }),
  user_preferences: Type.Object({
    lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
    avatar: Type.String(),
    banner: Type.String(),
    theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  })
})
export type UserRedisType = Static<typeof UserRedis>