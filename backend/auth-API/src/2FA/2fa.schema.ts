import { Static, Type } from "@sinclair/typebox";

export const sendEmailBody = Type.Object({
	email: Type.String({
		format: 'email'
	}),
	lang: Type.String()
}, {
	additionalProperties: false
});
export type sendEmailBodyType = Static<typeof sendEmailBody>;

export const verifyCodeBody = Type.Object({
	code: Type.String()
}, {
	additionalProperties: false
});
export type verifyCodeBodyType = Static<typeof verifyCodeBody>;