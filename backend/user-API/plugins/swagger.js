import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'

import { registerErrorSchema } from '@transcenduck/error'

function swagger_pl(fastify, opts, done) {
  if (!fastify.swagger) {
    fastify.register(swagger, {
      openapi: {
        openapi: '3.1.1',
        info: {
          title: opts?.title,
          description: opts?.description,
          version: opts?.version
        },
        schemes: opts?.schemes,
        consumes: opts?.schemes,
        produces: opts?.schemes,
        servers: opts?.servers,
        tags: opts?.tags,
        components: opts?.components
      }
    });

    registerErrorSchema(fastify);

    fastify.addSchema({
      $id: 'BaseSchema',
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['success', 'error'] },
        message: { type: 'string' },
      }
    })

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

export default fp(swagger_pl, { name: 'swagger' }); 
