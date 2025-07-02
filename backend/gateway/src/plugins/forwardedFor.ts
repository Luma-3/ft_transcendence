import fp from 'fastify-plugin'

import { FastifyPluginCallback } from 'fastify';

export interface ForwardedForOptions {
  searcher?: boolean;
}


const plugin: FastifyPluginCallback<ForwardedForOptions> = (fastify, opts, done) => {
  fastify.addHook('onRequest', async function(req, _) {
    if (opts.searcher && req.headers['x-forwarded-for']) {
      // If the header is already set, we do not override it
      return;
    }
    req.headers['x-forwarded-for'] = req.ip;
  });
  done();
}

export default fp(plugin, { name: 'forwarded-for' });
