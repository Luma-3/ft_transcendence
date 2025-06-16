import { FastifyInstance } from 'fastify';
import * as Controller from '../controllers/gameController.js';
import { RoomInfoSchema, RoomParametersSchema, RoomPlayerParametersSchema } from '../schemas/Room.js';
import { ResponseSchema } from '../utils/schema.js';
import { PlayerInitialSchema, PlayerInfoSchema, PlayersInfoSchema } from '../schemas/Player.js';
import { Type } from '@sinclair/typebox';
import { InternalServerErrorResponse } from '@transcenduck/error';

export default async function(fastify: FastifyInstance) {
  fastify.post('/rooms/join', {
    schema : {
      body: PlayerInitialSchema,
      response: {
        201: ResponseSchema(Type.Object({
          id: Type.String({
            format: 'uuid',
            description: 'Unique identifier for the room, formatted as a UUID'
          })
        }), 'Player added to room'),
        500: InternalServerErrorResponse
      }
    }
  }, Controller.postPlayer);

  fastify.get('/rooms/:roomId', {
    schema: {
      params: RoomParametersSchema,
      response: {
        200: ResponseSchema(RoomInfoSchema, 'Room info retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, Controller.getRoomInfo);

  fastify.get('/rooms/:roomId/players', {
    schema: {
      params: RoomParametersSchema,
      response: {
        200: ResponseSchema(PlayersInfoSchema, 'Players list retrived'),
        500: InternalServerErrorResponse
      }
    }
  }, Controller.getRoomPlayers);

  fastify.get('/rooms/:roomId/players/:playerId', {
    schema: {
      params: RoomPlayerParametersSchema,
      response: {
        200: ResponseSchema(PlayerInfoSchema, 'Player info retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, Controller.getPlayerInfo);

  fastify.get('/rooms/:roomId/opponents/:playerId', {
    schema: {
      params: RoomPlayerParametersSchema,
      response: {
        200: ResponseSchema(PlayersInfoSchema, 'Opponents List retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, Controller.getPlayerOpponentsInfo);
}
