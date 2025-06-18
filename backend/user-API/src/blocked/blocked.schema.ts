import { Type, Static } from '@sinclair/typebox';

export * from '../preferences/preferences.schema.js';
export * from '../users/user.schema.js';


export const BlockedDBSchema = Type.Object({
  id: Type.Integer({ description: 'Unique identifier for the blocked user relationship' }),
  user_id: Type.String({ format: 'uuid', description: 'ID of the user who blocked another user' }),
  blocked_id: Type.String({ format: 'uuid', description: 'ID of the user who is blocked' })
}, {
  description: "Database schema for blocked users",
  additionalProperties: false
});

export const BlockedDBHydrateSchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'ID of the blocked user' }),
  username: Type.Optional(Type.String({ description: 'Username of the blocked user' })),
  avatar: Type.Optional(Type.String({ description: 'URL of the blocked user\'s avatar' })),
  banner: Type.Optional(Type.String({ description: 'URL of the blocked user\'s banner' }))
}, {
  description: "Hydrated schema for blocked users with user details",
  additionalProperties: false
});

export const BlockedParamSchema = Type.Object({
  blockedId: Type.String({ format: 'uuid', description: 'ID of the blocked user' })
}, {
  description: "Parameters for blocking or unblocking a user",
  additionalProperties: false
});

export const HydrateDBQuerySchema = Type.Object({
  hydrate: Type.Boolean({default: true, description: "Whether to hydrate the blocked data with user details"})
}, {
  description: "Query parameters for hydrating blocked data"
});


export const BlockedPendingResponseSchema = Type.Union([Type.Array(BlockedDBHydrateSchema), Type.Array(BlockedDBSchema)]);
export type BlockedDBType = Static<typeof BlockedDBSchema>;
export type BlockedDBHydrateType = Static<typeof BlockedDBHydrateSchema>;
export type BlockedResponseType = Static<typeof BlockedPendingResponseSchema>;
export type BlockedParamType = Static<typeof BlockedParamSchema>;
export type HydrateDBQueryType = Static<typeof HydrateDBQuerySchema>;