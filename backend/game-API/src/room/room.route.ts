import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { ResponseSchema } from '../utils/schema.js';
import { InternalServerErrorResponse, NotFoundResponse, ConflictResponse } from '@transcenduck/error';
import { GetRoomsHandler, GetRoomHandler, PostRoomHandler, DeleteRoomHandler, PostRoomIdHandler, GetKDStatsHandler } from './controller.js';
import { RoomResponseSchema, RoomParamSchema, RoomBodySchema, HeaderBearerSchema, RoomParamIdSchema, RoomParamUserIdSchema, RoomArray, RankResponseSchema } from './room.schema.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.get('/rooms/player/:roomType', {
    schema: {
      headers: HeaderBearerSchema,
      params: RoomParamSchema,
      response: {
        200: ResponseSchema(),
        404: NotFoundResponse,
        409: ConflictResponse,
        500: InternalServerErrorResponse
      }
    }
  }, GetRoomHandler);

  fastify.post('/rooms/:roomType', {
    schema: {
      body: RoomBodySchema,
      headers: HeaderBearerSchema,
      params: RoomParamSchema,
      /*    querystring: RoomQuerySchema, */
      response: {
        201: ResponseSchema(RoomResponseSchema, 'Player added to room'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }
  }, PostRoomHandler);

  fastify.delete('/rooms/player/:roomType', {
    schema: {
      headers: HeaderBearerSchema,
      params: RoomParamSchema,
      response: {
        200: ResponseSchema(),
        404: NotFoundResponse,
        409: ConflictResponse,
        500: InternalServerErrorResponse
      }
    }
  }, DeleteRoomHandler)

  fastify.get('/rooms/:userId', {
    schema: {
      headers: HeaderBearerSchema,
      params: RoomParamUserIdSchema,
      response: {
        200: ResponseSchema(RoomArray, 'Player added to room'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }
  }, GetRoomsHandler);


  fastify.post('/rooms/id/:roomId', {
    schema: {
      body: RoomBodySchema,
      params: RoomParamIdSchema,
      headers: HeaderBearerSchema,
      response: {
        201: ResponseSchema(RoomResponseSchema, 'Player joined private room'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }

  }, PostRoomIdHandler);


  fastify.get('/rank/:userId', {
    schema: {
      params: RoomParamUserIdSchema,
      response: {
        200: ResponseSchema(RankResponseSchema, 'Player rank retrieved'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }
  }, GetKDStatsHandler);
}

export default route;
