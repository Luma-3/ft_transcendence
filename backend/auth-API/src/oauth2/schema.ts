import { Type, Static } from '@sinclair/typebox';

export const QueryCallback = Type.Object({
  error: Type.Optional(Type.String()),
  state: Type.Optional(Type.String()),
  access_type: Type.Optional(Type.String()),
  include_granted_scopes: Type.Optional(Type.String()),
  response_type: Type.Optional(Type.String()),
  redirect_uri: Type.Optional(Type.String()),
  client_id: Type.Optional(Type.String()),
  code: Type.String(),
});

export type QueryCallbackType = Static<typeof QueryCallback>;
