import { Type, Static } from '@sinclair/typebox';

export * from '../preferences/preferences.schema.js';
export * from '../users/user.schema.js';


export const FriendDBSchema = Type.Object({
  id: Type.Integer({ description: 'Unique identifier for the friend relationship' }),
  user_id: Type.String({ format: 'uuid', description: 'ID of the user who has friends' }),
  friend_id: Type.String({ format: 'uuid', description: 'ID of the user who is a friend' }),
  username: Type.String()
});

export const FriendDBHydrateSchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'ID of the user who is a friend' }),
  username: Type.String({ description: 'Username of the friend' }),
  avatar: Type.Optional(Type.String({ format: 'uri', description: 'URL of the user\'s avatar' })),
  banner: Type.Optional(Type.String({ format: 'uri', description: 'URL of the user\'s banner' }))
});

export const FriendParamSchema = Type.Object({
  friendId: Type.String({ format: 'uuid', description: 'ID of the friend' })
});

export const FriendResponseSchema = Type.Array(FriendDBHydrateSchema);
export type FriendDBType = Static<typeof FriendDBSchema>;
export type FriendDBHydrateType = Static<typeof FriendDBHydrateSchema>;
export type FriendResponseType = Static<typeof FriendResponseSchema>;
export type FriendParamType = Static<typeof FriendParamSchema>;