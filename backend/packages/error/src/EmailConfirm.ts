import { BaseError } from "./BaseError.js";
import { Type, Static } from '@sinclair/typebox'

export class EmailConfirmError<T = unknown> extends BaseError<T> {
	constructor(message = 'EmailConfirm', details?:T) {
		super(message, 461, 'PENDING_EMAIL_CONFIRM', details)
	}
}

export const EmailConfirmResponse = Type.Object({
	status: Type.Literal('error'),
	statusCode: Type.Literal(461),
	code: Type.Literal('PENDING_EMAIL_CONFIRM'),
	message: Type.String({ description: 'Explanation of why email failed' }),
	details: Type.Optional(Type.Object({
		reason: Type.String({ description: 'Reason for unscent mail' })
	}))
})

export type EmailConfirmResponseType = Static<typeof EmailConfirmResponse>
