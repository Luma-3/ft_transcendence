import cookie from '@fastify/cookie'
import oauth2 from '@fastify/oauth2'
import bcrypt from 'fastify-bcrypt'
import fastifyMultipart from '@fastify/multipart'
import jwt from '@fastify/jwt'
import formateur from '@transcenduck/formateur'

import knex from '../plugins/knex.js'
import swagger from '../plugins/swagger.js'

import knex_config from './knex.config.js'

export default function config(fastify) {
  fastify.register(formateur);

  fastify.register(knex, knex_config);
  fastify.register(bcrypt, { saltWorkFactor: 12 });
  fastify.register(cookie);
  fastify.register(fastifyMultipart);

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      iss: process.env.GATEWAY_IP,
      expiresIn: '1d',
    }
  });

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
    callbackUri: 'http://localhost:3001/oauth',
    cookie: {
      path: '/',
      secure: true,
      sameSite: 'lax',
      httpOnly: true
    }
  });

  fastify.register(swagger, {
    title: 'User Service API',
    description: 'Endpoints for user management',
    route: '/doc/json',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Users', description: 'Endpoints for managing user accounts and accessing personal or public user information.' },
      { name: 'Sessions', description: 'Endpoints related to user session creation and termination.' }
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


