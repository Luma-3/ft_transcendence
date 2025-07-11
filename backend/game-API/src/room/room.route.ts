import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { ResponseSchema } from '../utils/schema.js';
import { InternalServerErrorResponse, NotFoundResponse } from '@transcenduck/error';
import { PostRoomHandler, PostRoomIdHandler } from './controller.js';
import { RoomResponseSchema, RoomParamSchema, RoomBodySchema, HeaderBearerSchema } from './room.schema.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.post('/rooms/:roomType', {
    schema: {
      body: RoomBodySchema,
      headers: HeaderBearerSchema,
      params: RoomParamSchema,
      response: {
        201: ResponseSchema(RoomResponseSchema, 'Player added to room'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }
  }, PostRoomHandler);

  // fastify.get('/rooms/:game_id', {
  //   schema: {
  //     params: GameIdSchema,
  //     response: {
  //       200: ResponseSchema(RoomInfoSchema, 'Room info retrieved'),
  //       500: InternalServerErrorResponse
  //     }
  //   }
  // }, async (req, rep) => {
  //   const roomId = req.params.id;
  //   const room = RoomService.getRoomById(roomId);
  //
  //   return rep.code(200).send({
  //     message: 'Room info retrieved',
  //     data: room.toJSON()
  //   });
  // });


  // TODO : Remmettre pour les invite le principe de room privée
  // fastify.post('/rooms/',
  //   {
  //     schema: {
  //       body: PlayerInitialSchema,
  //       headers: HeaderBearer,
  //       response: {
  //         201: ResponseSchema(GameIdSchema, 'Private room created'),
  //         500: InternalServerErrorResponse
  //       }
  //     }
  //   }, async (req: FastifyRequest<{ Body: PlayerInitialType }>, rep: FastifyReply) => {
  //     const { playerName } = req.body;
  //     const user_id = req.headers['x-user-id'] as string;
  //
  //     const player = new Player(user_id, playerName);
  //     const room = RoomService.createPrivateRoom(player);
  //
  //     return rep.code(201).send({
  //       message: 'Private room created',
  //       data: { id: room }
  //     });
  //   });


  fastify.post('/rooms/id/:roomId', {
    schema: {
      body: RoomBodySchema,
      params: RoomParamSchema,
      headers: HeaderBearerSchema,
      response: {
        201: ResponseSchema(RoomResponseSchema, 'Player joined private room'),
        404: NotFoundResponse,
        500: InternalServerErrorResponse
      }
    }
  }, PostRoomIdHandler);
}

export default route;
