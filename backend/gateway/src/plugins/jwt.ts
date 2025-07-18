import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'

import { UnauthorizedError } from '@transcenduck/error'
import { FastifyPluginCallback } from 'fastify';

export interface JWTOptions {
  secret: string;
  publicRoutes: Array<{ method: string; url: string | RegExp }>;
}

interface JWTPayload {
  sub: string;
  username: string;
}

const plugin: FastifyPluginCallback<JWTOptions> = (fastify, opts, done) => {
  if (fastify.jwt) return done();
  fastify.register(jwt, opts);

  fastify.addHook('onRequest', async function(req, rep) {
    console.log('JWT:' + req.url);
    const isPublic = opts.publicRoutes.some(route => {
      const nethodMatch = route.method.toUpperCase() === req.method.toUpperCase();
      const urlMatch = route.url instanceof RegExp
        ? route.url.test(req.url)
        : req.url.startsWith(route.url);
      return nethodMatch && urlMatch;
    });
    if (isPublic) return;

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.split(' ')[1];
    const token = req.cookies.accessToken || bearerToken;

    if (!token) {
      throw new UnauthorizedError('authorization token is missing');
    }

    try {
      const user = fastify.jwt.verify<JWTPayload>(token);
      if (!user || !user.sub) {
        rep.clearCookie('accessToken');
        throw new UnauthorizedError('Invalid token payload');
      }

      req.headers['x-user-id'] = user.sub;
      // req.headers['x-user-username'] = user.username;
    }
    catch (error) {
      rep.clearCookie('accessToken');
      throw new UnauthorizedError('Invalid or expired token');
    }
  });
  done();
}

export default fp(plugin, { name: 'jwt' });
