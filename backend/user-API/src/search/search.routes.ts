import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { SearchController } from './search.controller.js';
import { SearchQuerySchema, SearchResponseSchema, UserHeaderAuthentication } from './search.schema.js';
import { ResponseSchema } from '../utils/schema.js';
import { InternalServerErrorResponse, NotFoundResponse } from '@transcenduck/error';
import { FastifyInstance } from 'fastify';
const route: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance) => {
    fastify.get('/search', {
        schema: {
            summary: 'Search users',
            description: 'Endpoint to search for users by username',
            tags: ['Search', 'Users'],
            headers: UserHeaderAuthentication,
            querystring: SearchQuerySchema,
            response: {
                200: ResponseSchema(SearchResponseSchema, 'Search results for the given query'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, SearchController.search);
}

export default route;
