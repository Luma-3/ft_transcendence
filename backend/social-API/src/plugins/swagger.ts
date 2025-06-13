import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'

import { FastifyPluginCallback } from 'fastify'

export interface SwaggerOptions {
  title: string;
  description?: string;
  version: string;
  servers?: Array<{ url: string; description?: string }>;
  tags?: Array<{ name: string; description?: string }>;
  components?: Record<string, any>;
  route?: string;
}

const plugin: FastifyPluginCallback<SwaggerOptions> = (fastify, opts, done) => {
  if (!fastify.swagger) {
    fastify.register(swagger, {
      openapi: {
        openapi: '3.1.1',
        info: {
          title: opts?.title,
          description: opts?.description,
          version: opts?.version
        },
        servers: opts?.servers,
        tags: opts?.tags,
        components: opts?.components
      }
    });

    if (opts.route !== undefined) {
      fastify.get(opts.route, { schema: { hide: true } },
        async (_, rep) => {
          rep.send(fastify.swagger());
        }
      )
    }
  }
  done();
}

export default fp(plugin, { name: 'swagger' }); 
