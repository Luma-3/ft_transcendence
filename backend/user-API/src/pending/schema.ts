import { Type, Static } from '@sinclair/typebox';

export * from '../preferences/schema.js';
export * from '../users/schema.js';


export const PendingDBSchema = Type.Object({
  id: Type.Integer(),
  user_id: Type.String({ format: 'uuid', description: 'ID of the user who received the pending request' }),
  pending_id: Type.String({ format: 'uuid', description: 'ID of the user who sent the pending request' })
}, {
  description: "Pending request schema for database operations",
  additionalProperties: false
});

export const PendingDBHydrateSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  avatar: Type.Optional(Type.String({ description: 'URL of the user\'s avatar' })),
  banner: Type.Optional(Type.String({ description: 'URL of the user\'s banner' }))
}, {
  description: "Hydrated pending request schema with user details",
  additionalProperties: false
});

export const PendingParamSchema = Type.Object({
  pendingId: Type.String({ format: 'uuid', description: 'ID of the pending request to be added' }),
}, {
  description: "Parameters for adding a pending request",
});

export const AcceptParamSchema = Type.Object({
  senderId: Type.String({ format: 'uuid', description: 'ID of the user who sent the pending request' }),
}, {
  description: "Parameters for accepting or refusing a pending request"
});

export const TypePendingQuerySchema = Type.Object({
  action: Type.Union([
    Type.Literal("sender"),
    Type.Literal("receiver"),
  ], {
    default: "sender",
    description: "Action type to filter pending requests by sender or receiver"
  })
}, {
  description: "Parameters for filtering pending requests"
});

export const PendingResponseSchema = Type.Array(PendingDBHydrateSchema);
export type PendingDBType = Static<typeof PendingDBSchema>;
export type PendingDBHydrateType = Static<typeof PendingDBHydrateSchema>;
export type PendingResponseType = Static<typeof PendingResponseSchema>;
export type PendingParamType = Static<typeof PendingParamSchema>;
export type TypePendingQueryType = Static<typeof TypePendingQuerySchema>;
export type AcceptParamType = Static<typeof AcceptParamSchema>;