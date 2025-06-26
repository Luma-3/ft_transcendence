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

export const userPrivateInfos = Type.Object({
	id:						Type.String({ format: 'uuid' }),
	username:			Type.String(),
	email:				Type.String(),
	validated:		Type.Boolean(),
	twofa:				Type.Boolean(),
	created_at:		Type.String(),
	preferences:	Type.Object({
		theme: 			Type.String(),
		lang:				Type.String()
	})
});
export type userPrivateInfosType = Static<typeof userPrivateInfos>;

export const userApiFetch = Type.Object({
	status: Type.Optional(Type.String({ default: 'success' })),
	message: Type.String({ default: 'Request completed successfully' }),
	data: Type.Any()
});
export type userApiFetchType = Static<typeof userApiFetch>;

export const ValidationEmailQueryGet = Type.Object({
  token: Type.String({format: 'uuid', description: 'Token for user identification'}),
}, {
  additionalProperties: false
});

export type ValidationEmailQueryGetType = Static<typeof ValidationEmailQueryGet>;
