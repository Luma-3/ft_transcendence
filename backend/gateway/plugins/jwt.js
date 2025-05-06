import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'

import {UnauthorizedError} from '@transcenduck/error'

function jwt_pl(fastify, opts, done) {
  if (!fastify.jwt) {
    fastify.register(jwt, opts);

    fastify.addHook('onRequest', async function(req, rep) {
      const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : ''
      if (
        req.url.startsWith(dev_prefix + '/user/register') ||
        req.url.startsWith(dev_prefix + '/user/login')		||
        req.url.startsWith(dev_prefix + '/user/oauth')		||
        req.url.startsWith('/doc')												||
        req.url.endsWith('/doc/json')
      ) return;

      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        return rep.code(401).send({message: "Token is required"});
      }

      try {
        req.user = await fastify.jwt.verify(token);
        req.headers['x-user-id'] = req.user.id;
        req.headers['x-user-username'] = req.user.username;
      }
      catch (error) {
        throw new UnauthorizedError('Invalid or expired token', error.message);
        req.log.error(error);
      }
    });
  }
  done();
}

export default fp(jwt_pl, {name: 'jwt'});
