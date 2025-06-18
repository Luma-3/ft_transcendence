import { Type } from '@sinclair/typebox';

export const FriendsBase = Type.Object({
	user_id: Type.String(),
	friend_id: Type.String(),
	status: Type.Enum({
		PENDING: 'pending',
		BLOCKED: 'blocked'
	}, {
		additionalProperties: false,
		description: 'Relationship status between users.\
		 Can be "pending" for friend requests or "blocked" for blocked users.'
	}),
})