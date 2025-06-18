import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { gameService } from './room.service.js';
import { redisSub } from '../utils/redis.js';

import { RoomInfoSchema, RoomParametersSchema, RoomPlayerParametersSchema } from './room.schema.js';
import { PlayerInitialSchema, PlayerInfoSchema, PlayersInfoSchema } from './player.schema.js';
import { ResponseSchema } from '../utils/schema.js';

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from '@sinclair/typebox';

import { RoomParametersType, RoomPlayerParametersType } from './room.schema.js';
import { PlayerInitialType, PlayerType } from './player.schema.js';

import { InternalServerErrorResponse, NotFoundError } from '@transcenduck/error';

const route : FastifyPluginAsyncTypebox = async (fastify: FastifyInstance) => {
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
  }, async (req: FastifyRequest<{Body: PlayerInitialType}>, rep: FastifyReply) => {
      const data = req.body;
    
      const player : PlayerType = {
        playerId: data.playerId,
        gameName: data.gameName,
        clientId: '0',
        joined: false,
        ready: false,
        score: 0
      };
    
      const roomId = gameService.joinRoom(player, data.typeGame);
    
      if (!roomId) {
        return rep.code(500).send({
          message: 'Failed to join room'
        });
      }
      rep.code(201).send({
        message: 'Player added to room',
        data: { id: roomId }
      });
  });

  fastify.get('/rooms/:roomId', {
    schema: {
      params: RoomParametersSchema,
      response: {
        200: ResponseSchema(RoomInfoSchema, 'Room info retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, async (req: FastifyRequest<{Params: RoomParametersType}>, rep: FastifyReply) => {
    const roomId = req.params.roomId;
    const room = gameService.getRoom(roomId);

    if (!room) {
      return rep.code(500).send({
        message: 'Room not found'
      });
    }

    return rep.code(200).send({
      message: 'Room info retrieved',
      data: room.roomInfos()
    });
  });

  fastify.get('/rooms/:roomId/players', {
    schema: {
      params: RoomParametersSchema,
      response: {
        200: ResponseSchema(PlayersInfoSchema, 'Players list retrived'),
        500: InternalServerErrorResponse
      }
    }
  }, async (req: FastifyRequest<{Params: RoomParametersType}>, rep: FastifyReply) => {
    const room = gameService.getRoom(req.params.roomId);

    if (!room) {
      throw new NotFoundError("Room");
    }

    return rep.code(200).send({
      message: 'Players list retrived',
      data: room.toJSON().players
    });
  });

  fastify.get('/rooms/:roomId/players/:playerId', {
    schema: {
      params: RoomPlayerParametersSchema,
      response: {
        200: ResponseSchema(PlayerInfoSchema, 'Player info retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, async (req: FastifyRequest<{Params: RoomPlayerParametersType}>, rep: FastifyReply) => {
    const room = gameService.getRoom(req.params.roomId);
    if (!room) {
      return rep.code(500).send({ message: 'Room not found' });
    }

    const player = room.getPlayerById(req.params.playerId);
    if (!player) {
      return rep.code(500).send({
        message: `Player not found in room ${req.params.roomId}`
      });
    }

    const playerInfo = {
      playerId: player.playerId,
      gameName: player.gameName,
      ready: player.ready
    }

    return rep.code(200).send({
      message: 'Player infos retrived',
      data: playerInfo
    });
  });

  fastify.get('/rooms/:roomId/opponents/:playerId', {
    schema: {
      params: RoomPlayerParametersSchema,
      response: {
        200: ResponseSchema(PlayersInfoSchema, 'Opponents List retrieved'),
        500: InternalServerErrorResponse
      }
    }
  }, async (req: FastifyRequest<{Params: RoomPlayerParametersType}>, rep: FastifyReply) => {
    const room = gameService.getRoom(req.params.roomId);
    if (!room) {
      return rep.code(500).send({ message: 'Room not found' });
    }

    const player = room.getPlayerById(req.params.playerId);
    if (!player) {
      return rep.code(500).send({ message: 'player not found' });
    }

    const opponents = room.userOpponentInfo(player);

    return rep.code(200).send({ message: 'Player infos retrived', data: opponents });
  });
}

export default route;

export async function handlerEvent() {
  redisSub.subscribe('ws.game.in', (raw: string) => {
    const message = JSON.parse(raw);
    gameService.handleEvent(message.clientId, message.payload);
  })

  // redisSub.subscribe('ws.broadcast.disconnect', (raw: string) => {
  //   const message = JSON.parse(raw);
  //   gameService.leave_room());
  // })
}