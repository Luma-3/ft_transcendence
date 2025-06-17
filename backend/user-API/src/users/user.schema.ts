import { Type, Static } from '@sinclair/typebox';

import {
  PreferencesBase,
  PreferencesPublicResponse,
  PreferencesPrivateResponse,
  PreferencesUpdateBody
} from "../preferences/preferences.schema.js";

// Share Field Utilities
// To avoid duplication, we define shared fields for user Utilities


const passwordField = Type.String({
  pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
  minLength: 8,
  maxLength: 255
});

const UserSharedFields = {
  id: Type.String({ format: 'uuid' }),
  username: Type.String({ minLength: 2, maxLength: 32 }),
  created_at: Type.String({ format: 'date-time' }),
};

// User Base Schema (Principal Interface for Swagger and TypeScript)

export const UserBase = Type.Object({
  ...UserSharedFields,
  email: Type.String({ format: 'email' }),
  password: passwordField,
  preferences: Type.Optional(PreferencesBase)
});
export type UserBaseType = Static<typeof UserBase>;

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
  preferences: Type.Optional(PreferencesPublicResponse)
});
export type UserPublicResponseType = Static<typeof UserPublicResponse>;

export const UserPrivateResponse = Type.Object({
  ...UserSharedFields,
  email: Type.String({ format: 'email' }),
  preferences: Type.Optional(PreferencesPrivateResponse)
});
export type UserPrivateResponseType = Static<typeof UserPrivateResponse>;

// User Create and Update Schemas
// These schemas are used for creating and updating user data, including validation for fields like username, email, and password.

export const UserCreateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 32 }),
  email: Type.String({ format: 'email' }),
  password: passwordField,
  preferences: Type.Optional(PreferencesUpdateBody)
}, {
  additionalProperties: false
});
export type UserCreateBodyType = Static<typeof UserCreateBody>;

export const UserPasswordUpdateBody = Type.Object({
  oldPassword: Type.String(),
  password: passwordField
});
export type UserPasswordUpdateBodyType = Static<typeof UserPasswordUpdateBody>;

export const UserEmailUpdateBody = Type.Object({
  email: Type.String({ format: 'email' })
});
export type UserEmailUpdateBodyType = Static<typeof UserEmailUpdateBody>;

export const UserUsernameUpdateBody = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 32 })
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
export type UserHeaderIdType = Static<typeof UserHeaderAuthentication>;

// Internal User Schema

export const VerifyCredentials = Type.Object({
  username: Type.String({ minLength: 2, maxLength: 32 }),
  password: Type.String()
}, {
  additionalProperties: false
});
export type VerifyCredentialsType = Static<typeof VerifyCredentials>;
