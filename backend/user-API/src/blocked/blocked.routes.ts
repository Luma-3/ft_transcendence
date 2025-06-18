import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { BlockedController } from './blocked.controller.js';
import { BlockedParamSchema, BlockedPendingResponseSchema, HydrateDBQuerySchema, UserHeaderAuthentication } from './blocked.schema.js';
import { ResponseSchema } from '../utils/schema.js';
import { InternalServerErrorResponse, NotFoundResponse } from '@transcenduck/error';
import { FastifyInstance } from 'fastify';

const route: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance) => {
    fastify.get('/blocked', {
        schema: {
            summary: 'Get blocked users',
            description: 'Endpoint to retrieve blocked users for the current user',
            tags: ['Friends', 'Blocked'],
            headers: UserHeaderAuthentication,
            querystring: HydrateDBQuerySchema,
            response: {
                200: ResponseSchema(BlockedPendingResponseSchema, 'Blocked users retrieved successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, BlockedController.getBlocked);
    fastify.post('/blocked/:blockedId', {
        schema: {
            summary: 'Block a user',
            description: 'Endpoint to block a user and remove them from friends if they are friends',
            tags: ['Friends', 'Blocked'],
            headers: UserHeaderAuthentication,
            params: BlockedParamSchema,
            response: {
                201: ResponseSchema(undefined, 'Blocked user added successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, BlockedController.block);
    fastify.delete('/blocked/:blockedId', {
        schema: {
            summary: 'Remove a blocked user',
            description: 'Endpoint to remove a blocked user and unblock them',
            tags: ['Friends', 'Blocked'],
            headers: UserHeaderAuthentication,
            params: BlockedParamSchema,
            response: {
                200: ResponseSchema(undefined, 'Blocked user removed successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        }
    }, BlockedController.unBlock);
}

export default route;
