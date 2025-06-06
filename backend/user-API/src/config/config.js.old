import cookie from '@fastify/cookie'
import oauth2 from '@fastify/oauth2'
import bcrypt from 'fastify-bcrypt'
import fastifyMultipart from '@fastify/multipart'
import jwt from '@fastify/jwt'
import formatter from '@transcenduck/formatter'

import knex from '../plugins/knex.js'
import swagger from '../plugins/swagger.js'

import knex_config from './knex.config.js'

export const config_dev = {
  logger: true,
};

export async function registerPlugin(fastify) {
  await fastify.register(formatter);

  await fastify.register(knex, knex_config);
  await fastify.register(bcrypt, { saltWorkFactor: 12 });
  await fastify.register(cookie);
  await fastify.register(fastifyMultipart);

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      iss: process.env.GATEWAY_IP,
      expiresIn: '1d',
    }
  });

  await fastify.register(oauth2, {
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
    callbackUri: 'http://localhost:3001/oauth',
    cookie: {
      path: '/',
      secure: true,
      sameSite: 'lax',
      httpOnly: true
    }
  });

  await fastify.register(swagger, {
    title: 'User Service API',
    description: 'Endpoints for user management',
    route: '/doc/json',
    servers: [
      { url: '/user/', description: 'User Service' }
    ],
    tags: [
      { name: 'Users', description: 'Endpoints for managing user accounts and accessing personal or public user information.' },
      { name: 'Sessions', description: 'Endpoints related to user session creation and termination.' },
      { name: 'Preferences', description: 'Endpoints related to user preferences.' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  });
}


