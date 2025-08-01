import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { PendingsController } from './controller.js';
import { PendingParamSchema, PendingResponseSchema, UserHeaderAuthentication, TypePendingQuerySchema, AcceptParamSchema } from './schema.js';
import { ResponseSchema } from '../utils/schema.js';
import { ConflictResponse, InternalServerErrorResponse, NotFoundResponse } from '@transcenduck/error';
import { RoomBodySchema } from '../room/room.schema.js';

const route: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.get('/pending', {
        schema: {
            summary: 'Get pending requests',
            description: 'Endpoint to retrieve pending requests for the current user',
            tags: ['Game'],
            headers: UserHeaderAuthentication,
            querystring: TypePendingQuerySchema,
            response: {
                200: ResponseSchema(PendingResponseSchema, 'Pending requests retrieved successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, PendingsController.getPending);
    fastify.post('/pending/:pendingId', {
        schema: {
            summary: 'Accept a pending request',
            description: 'Endpoint to accept a pending request from another user',
            tags: ['Game'],
            headers: UserHeaderAuthentication,
            params: PendingParamSchema,
            body: RoomBodySchema,
            response: {
                200: ResponseSchema(undefined, 'Pending request accepted successfully'),
                409: ConflictResponse,
                500: InternalServerErrorResponse
            },
        },
    }, PendingsController.addPending);
    fastify.delete('/pending/:pendingId', {
        schema: {
            summary: 'Accept a pending request',
            description: 'Endpoint to accept a pending request from another user',
            tags: ['Game'],
            headers: UserHeaderAuthentication,
            params: PendingParamSchema,
            response: {
                200: ResponseSchema(undefined, 'Pending request accepted successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        },
    }, PendingsController.removePending);
    fastify.post('/pending/receiver/:senderId', {
        schema: {
            summary: 'Add a pending request',
            description: 'Endpoint to add a pending request to another user',
            tags: ['Game'],
            headers: UserHeaderAuthentication,
            params: AcceptParamSchema,
            response: {
                201: ResponseSchema(undefined, 'Pending request added successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        }
    }, PendingsController.acceptPending);
    fastify.delete('/pending/receiver/:senderId', {
        schema: {
            summary: 'Refuse a pending request',
            description: 'Endpoint to refuse a pending request from another user',
            tags: ['Game'],
            headers: UserHeaderAuthentication,
            params: AcceptParamSchema,
            response: {
                200: ResponseSchema(undefined, 'Pending request refused successfully'),
                404: NotFoundResponse,
                500: InternalServerErrorResponse
            },
        }
    }, PendingsController.refusePending);
}

export default route;
