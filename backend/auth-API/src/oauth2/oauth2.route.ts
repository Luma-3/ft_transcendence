import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Oauth2Controller } from './oauth2.controller.js';

import { QueryCallback } from './oauth2.schema.js'; // Assuming QueryCallback is defined in oauth2.schema.ts
const route: FastifyPluginAsyncTypebox = async (fastify) => {

  // ! Public
  fastify.get('/oauth2/google', {
    schema: {
      summary: 'Get Google OAuth2 authorization URL',
      description: 'This endpoint returns the Google OAuth2 authorization URL for user authentication.',
      tags: ['OAuth2'],

    }
  }, Oauth2Controller.getAuthorizationUrl);

  fastify.get('/oauth2/google/callback', {
    schema: {
      summary: 'Google OAuth2 callback',
      description: 'This endpoint handles the callback from Google after user authentication.',
      tags: ['OAuth2'],
      querystring: QueryCallback, // Assuming QueryCallback is defined in oauth2.schema.ts
    }
  }, Oauth2Controller.callback);
}

export default route;
