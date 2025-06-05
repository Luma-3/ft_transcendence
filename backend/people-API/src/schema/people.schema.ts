import { Type, Static, TString } from '@sinclair/typebox'

const FriendsBase = Type.Record(Type.String(), Type.String());
const BlockedBase = Type.Record(Type.String(),  Type.Union([Type.Literal('sender'), Type.Literal('receiver')]));
const PendingBase = BlockedBase;
export const PeoplesDBBase = Type.Object({
    user_id: Type.String({ format: 'uuid'}),
    username: Type.String(),
    friends: Type.String(),
    blocked: Type.String(),
    pending: Type.String(),
});

const FriendSelfReponse = Type.Object({
      user_id: Type.String(),
      username: Type.String()
    });
const BlockedSelfReponse = FriendSelfReponse;

const PendingSelfReponse = Type.Object({
      user_id: Type.String(),
      username: Type.String(),
      status: Type.Boolean()
    });

export const PeoplesResponseSelfBase = Type.Object({
    user_id: Type.String({ format: 'uuid'}),
    username: Type.String(),
    friends: Type.Optional(Type.Union([Type.Array(FriendSelfReponse), FriendsBase])),
    blocked: Type.Optional(Type.Union([Type.Array(BlockedSelfReponse), BlockedBase])),
    pending: Type.Optional(Type.Union([Type.Array(PendingSelfReponse), PendingBase])),
});

export const PeoplesResponsePublic = Type.Object({
    user_id: Type.String({ format: 'uuid'}),
    username: Type.String(),
    blocked: Type.Optional(Type.Boolean())
});


export const PeoplesBase = Type.Object({
    user_id: Type.String({ format: 'uuid'}),
    username: Type.String(),
    friends: FriendsBase,
    blocked: BlockedBase,
    pending: PendingBase,
});


export const PeoplesEventRedis = Type.Object(
  {
    user_id: Type.String({format: "uuid"}),
    action: Type.Union([Type.Literal('create'), Type.Literal('update'), Type.Literal('delete')]),
    payload: Type.Optional(Type.Record(Type.String(), Type.Any()))
  },
  {
    additionalProperties: false,
    minProperties: 1
  }
);

export const SearchGetType = Type.Object({
  search: Type.String({ format: 'uuid' }),
});

export type SearchGetType = Static<typeof SearchGetType>;

export type PeoplesBaseType = Static<typeof PeoplesBase>;
export type PeoplesEventRedisType = Static<typeof PeoplesEventRedis>;
export type PeoplesDBBaseType = Static<typeof PeoplesDBBase>;
export type FriendsBaseType = Static<typeof FriendsBase>;
export type SocialBaseType = Static<typeof PendingBase>;
export type ResponseSelfType = Static<typeof PeoplesResponseSelfBase>;
export type ResponsePublicType = Static<typeof PeoplesResponsePublic>;
export type FriendSelfReponseType = Static<typeof FriendSelfReponse>;
export type BlockedSelfReponseType = Static<typeof BlockedSelfReponse>;
export type PendingSelfReponseType = Static<typeof PendingSelfReponse>;

export type PeoplesSchemaType =  (keyof PeoplesDBBaseType)[];