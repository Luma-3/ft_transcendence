import { FastifyInstance } from 'fastify';
import * as Controller from '../controllers/gameController.js';
import { RoomInfoSchema, RoomParametersSchema } from '../schemas/Room.js';
import { ResponseSchema } from '../utils/schema.js';
import { PlayerInitialSchema } from '../schemas/Player.js';
import { Type } from '@sinclair/typebox';



export default async function(fastify: FastifyInstance) {
  // fastify.post('/games', Controller.postGame);

  fastify.post('/join', {
    schema : {
      body: PlayerInitialSchema,
      response: {
        201: ResponseSchema(Type.Object({
          id: Type.String({
            format: 'uuid',
            description: 'Unique identifier for the room, formatted as a UUID',
            example: '123e4567-e89b-12d3-a456-426614174000'
          })
        }), 'Player added to room'),
        500: ResponseSchema(undefined, 'Failed to join room', 'error')
      }
    }
  }, Controller.postPlayer);

  fastify.get('/:roomId', {
    schema: {
      params: RoomParametersSchema,
      response: {
        200: ResponseSchema(RoomInfoSchema, 'Room info retrieved'),
        404: ResponseSchema(undefined, 'Room not found', 'error')
      }
    }
  }, Controller.getRoomInfo); 
}
