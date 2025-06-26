import { BaseError } from "./BaseError.js";
import { Type, Static } from '@sinclair/typebox'

export class TwoFaError<T = unknown> extends BaseError<T> {
	constructor(message = '2fa required', details?:T) {
		super(message, 460, '2FA_REQUIRED', details)
	}
}

export const TwoFaResponse = Type.Object({
	status: Type.Literal('error'),
	statusCode: Type.Literal(460),
	code: Type.Literal('2FA_REQUIRED'),
	message: Type.String({ description: 'Explanation of why login failed' }),
	details: Type.Optional(Type.Object({
		reason: Type.String({ description: 'Reason for unscent mail' })
	}))
})

export type TwoFaResponseType = Static<typeof TwoFaResponse>
