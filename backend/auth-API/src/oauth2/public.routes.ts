import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Oauth2Controller } from './controller.js';

import { QueryCallback } from './schema.js'; // Assuming QueryCallback is defined in oauth2.schema.ts
import {  TwoFaResponse, UnauthorizedResponse } from '@transcenduck/error'; // Importing TwoFaError from the error module
const route: FastifyPluginAsyncTypebox = async (fastify) => {

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
      response: {
        301: {
          description: 'Redirects to the frontend with the access token',
          type: 'object',
          properties: {
            message: { type: 'string', default: 'Redirecting to frontend with access token' }
          }
        },
        401: UnauthorizedResponse,
        460: TwoFaResponse
      }
    }
  }, Oauth2Controller.callback);
}

export default route;
