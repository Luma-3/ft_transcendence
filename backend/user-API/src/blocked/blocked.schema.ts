import { Type, Static } from '@sinclair/typebox';

export * from '../preferences/preferences.schema.js';
export * from '../users/user.schema.js';


export const BlockedDBSchema = Type.Object({
  id: Type.Integer(),
  user_id: Type.String({ format: 'uuid' }),
  blocked_id: Type.String({ format: 'uuid' })
}, {
  description: "Database schema for blocked users",
  additionalProperties: false
});

export const BlockedDBHydrateSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.Optional(Type.String()),
  avatar: Type.Optional(Type.String()),
  banner: Type.Optional(Type.String())
}, {
  description: "Hydrated schema for blocked users with user details",
  additionalProperties: false
});

export const BlockedParamSchema = Type.Object({
  blockedId: Type.String({ format: 'uuid' })
}, {
  description: "Parameters for blocking or unblocking a user",
  additionalProperties: false
});

export const HydareteDBQuerySchema = Type.Object({
  hydrate: Type.Boolean({default: true, description: "Whether to hydrate the blocked data with user details"})
}, {
  description: "Query parameters for hydrating blocked data"
});


export const BlockedPendingResponseSchema = Type.Union([Type.Array(BlockedDBHydrateSchema), Type.Array(BlockedDBSchema)]);
export type BlockedDBType = Static<typeof BlockedDBSchema>;
export type BlockedDBHydrateType = Static<typeof BlockedDBHydrateSchema>;
export type BlockedResponseType = Static<typeof BlockedPendingResponseSchema>;
export type BlockedParamType = Static<typeof BlockedParamSchema>;
export type HydrateDBQueryType = Static<typeof HydareteDBQuerySchema>;