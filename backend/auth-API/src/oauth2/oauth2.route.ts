import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const route: FastifyPluginAsyncTypebox = async (fastify) => {

  // ! Public
  fastify.get('/oauth2/google', {
    schema: {
      summary: 'Get Google OAuth2 authorization URL',
      description: 'This endpoint returns the Google OAuth2 authorization URL for user authentication.',
      tags: ['OAuth2'],

    }
  }, async (req, rep) => {

  });
}

export default route;
