import { Static, Type } from "@sinclair/typebox";

export const sendEmailBody = Type.Object({
	email: Type.String({ format: 'email' }),
	lang: Type.String(),
	token: Type.Optional(Type.String({ format: 'uuid' }))
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

export const CodeValidationBody = Type.Object({
  code: Type.String({format: 'uuid', description: 'code for user identification'}),
});

export type CodeValidationBodyType = Static<typeof CodeValidationBody>;

export const UserRedis = Type.Object({
  user_obj: Type.Object({
    username: Type.String({ format: 'uuid' }),
    password: Type.String(),
    email: Type.String({ format: 'email' }),
  }),
  user_preferences: Type.Object({
    lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
    avatar: Type.String(),
    banner: Type.String(),
    theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
  })
})
export type UserRedisType = Static<typeof UserRedis>

export const UserPublicResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  username: Type.String({ minLength: 2, maxLength: 32 }),
  created_at: Type.String({ format: 'date-time' }),
  preferences: Type.Optional(Type.Object({
		theme: Type.Union([Type.Literal('dark'), Type.Literal('light')]),
		lang: Type.Union([Type.Literal('en'), Type.Literal('fr'), Type.Literal('es')]),
		avatar: Type.String({ format: 'uri' }),
		banner: Type.String({ format: 'uri' })
	}))
});
export type UserPublicResponseType = Static<typeof UserPublicResponse>;