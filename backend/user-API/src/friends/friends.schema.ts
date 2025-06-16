import { Type, Static } from '@sinclair/typebox';

export * from '../schema/preferences.schema.js';
export * from '../schema/user.schema.js';


export const FriendDBSchema = Type.Object({
  id: Type.Integer(),
  user_id: Type.String({ format: 'uuid' }),
  friend_id: Type.String({ format: 'uuid' }),
  username: Type.String()
});

export const FriendDBHydrateSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String(),
  avatar: Type.Optional(Type.String()),
  banner: Type.Optional(Type.String())
});

export const FriendParamSchema = Type.Object({
  friendId: Type.String({ format: 'uuid' })
});

export const FriendResponseSchema = Type.Array(FriendDBHydrateSchema);
export type FriendDBType = Static<typeof FriendDBSchema>;
export type FriendDBHydrateType = Static<typeof FriendDBHydrateSchema>;
export type FriendResponseType = Static<typeof FriendResponseSchema>;
export type FriendParamType = Static<typeof FriendParamSchema>;