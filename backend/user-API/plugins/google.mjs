import oauth2 from '@fastify/oauth2'

export default async function (fastify) {
	fastify.register(oauth2, {
		name: 'googleOAuth2',
		credentials: {
			client: {
				id: process.env.GOOGLE_CLIENT_ID,
				secret: process.env.GOOGLE_CLIENT_SECRET
			},
			auth: oauth2.GOOGLE_CONFIGURATION
		},
		scope: ['openid', 'email', 'profile'],
		startRedirectPath: '/login/google',
		callbackUri: 'http://localhost:3000/api/user/oauth'
	});
}