import formatter from '@transcenduck/formatter'

// import knex from '../plugins/knex.js'
import swagger from '../plugins/swagger.js'

// import knex_config from './knex.config.js'

export default async function config(fastify) {
    await fastify.register(formatter);
    // await fastify.register(knex, knex_config);
    
    await fastify.register(swagger, {
        title: 'Game Service API',
        description: 'Endpoints for game management',
        route: '/doc/json',
        servers: [
            { url: '/game/', description: 'Game Service' }
        ],
        tags: [],
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