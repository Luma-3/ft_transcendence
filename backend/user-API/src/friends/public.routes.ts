import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FriendsController } from './controller.js';
import { FriendParamSchema, FriendResponseSchema, UserHeaderAuthentication } from './schema.js';
import { ResponseSchema } from '../utils/schema.js';
import { InternalServerErrorResponse, NotFoundResponse } from '@transcenduck/error';
import { FastifyInstance } from 'fastify';
const route: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance) => {
    fastify.get('/friends', {
        schema: {
            summary: 'Get friends',
            description: 'Endpoint to retrieve the list of friends for the current user',
            tags: ['Friends'],
            headers: UserHeaderAuthentication,
            response: {
                200: ResponseSchema(FriendResponseSchema, 'Friends retrieved successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, FriendsController.getFriends);
    fastify.delete('/friends/:friendId', {
        schema: {
            summary: 'Remove a friend',
            description: 'Endpoint to remove a friend from the current user\'s friend list',
            tags: ['Friends'],
            headers: UserHeaderAuthentication,
            params: FriendParamSchema,
            response: {
                200: ResponseSchema(undefined, 'Friendship removed successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, FriendsController.removeFriend);
}

export default route;
