import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'

import { UnauthorizedError } from '@transcenduck/error'

function jwt_pl(fastify, opts, done) {
  if (!fastify.jwt) {
    fastify.register(jwt, opts);

    fastify.addHook('onRequest', async function(req, rep) {
      console.log(req.url);
      const isPublic = opts.publicRoutes.some(route => {
        const nethodMatch = route.method.toUpperCase() === req.method.toUpperCase();
        const urlMatch = route.url instanceof RegExp
          ? route.url.test(req.url)
          : req.url.startsWith(route.url);
        return nethodMatch && urlMatch;
      });
      if (isPublic) return;

      const authHeader = req.headers['authorization'] || '';
      const [_, bearerToken] = authHeader.split(' ');
      const token = req.cookies.accessToken || bearerToken;

      if (!token) {
        throw new UnauthorizedError('authorization token is missing');
      }

      try {
        console.log('token', token);
        req.user = fastify.jwt.verify(token);
        console.log('USER', req.user);
        req.headers['x-user-id'] = req.user.userID;
        req.headers['x-user-username'] = req.user.username;
      }
      catch (error) {
        throw new UnauthorizedError('Invalid or expired token');
      }
    });
  }
  done();
}

export default fp(jwt_pl, { name: 'jwt' });
