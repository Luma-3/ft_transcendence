import { Type, Static } from '@sinclair/typebox';


export const SessionPostBody = Type.Object({
  username: Type.String(),
  password: Type.String()
}, {
  additionalProperties: false,
  description: 'Credentials for user session creation. The username and password are required to authenticate the user.'
});
export type SessionPostBodyType = Static<typeof SessionPostBody>;

// export type CookieResponseType = Static<typeof CookieResponse>;
export const FamilyId = Type.Object({
  familyId: Type.String()
})

export const RefreshTokenBase = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  family_id: Type.String(),
  ip_address: Type.String(),
  device_id: Type.String(),
  user_agent: Type.String(),
  created_at: Type.Optional(Type.String({ format: 'timestamp' })),
  expired_at: Type.Optional(Type.String({ format: 'timestamp' })),
  last_used: Type.Optional(Type.String({ format: 'timestamp' }) || Type.Null()),
  is_active: Type.Optional(Type.Boolean())
});
export type RefreshTokenBaseType = Static<typeof RefreshTokenBase>

export const FamiliesResponse = Type.Array(RefreshTokenBase)
export type FamiliesResponseType = Static<typeof FamiliesResponse>

export const UserHeaderAuthentication = Type.Object({
  'x-user-id': Type.String({ format: 'uuid' }),
}, {
  additionalProperties: false
});
export type UserHeaderIdType = Static<typeof UserHeaderAuthentication>;

export const twoFaBody = Type.Object({
  code: Type.String()
});
export type twoFaBodyType = Static<typeof twoFaBody>;
