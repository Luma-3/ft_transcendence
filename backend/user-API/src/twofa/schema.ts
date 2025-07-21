import { Type, Static } from '@sinclair/typebox';

export const twofaStatus = Type.Object({
  twofa: Type.Boolean({
    description: 'Indicates if the user has activated or not 2 Factor Authentification.'
  })
});
export type User2faStatusType = Static<typeof twofaStatus>;

export const headerUserID = Type.Object({
	userID: Type.String({
		format: 'uuid',
		description: 'User ID needed in fonction and gived on header'
	})
});
export type headerUserIDType = Static<typeof headerUserID>