import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'

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
        servers: opts?.servers,
        tags: opts?.tags,
        components: opts?.components
      }
    });


    fastify.addSchema({
      $id: 'BaseSchema',
      description: 'default Response',
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['success', 'error'] },
        message: { type: 'string' },
      },
      required: ['status', 'message']
    })

    fastify.decorate('addSchemaFormater', function(schema) {
      fastify.addSchema(schema);
      fastify.addSchema({
        $id: schema.$id + 'Base',
        description: schema.description + ' ( + Base Fromat )',
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success', 'error'] },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: schema.properties
          }
        }
      });
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
