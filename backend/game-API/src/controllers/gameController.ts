import { FastifyReply, FastifyRequest } from 'fastify';
import { redisSub } from '../utils/redis.js';
import { gameService } from '../services/gameService.js';
import { RoomParametersType } from '../schemas/Room.js';
import { PlayerInitialType, PlayerType } from '../schemas/Player.js';

export async function postPlayer(req: FastifyRequest<{Body: PlayerInitialType}>, rep: FastifyReply) {
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
    return rep.code(500).send({ message: 'Failed to join room' });
  }
  rep.code(201).send({ message: 'Player added to room', data: { id: roomId } });
}

export async function getRoomInfo(req: FastifyRequest<{Params: RoomParametersType}>, rep: FastifyReply) {
  const roomId = req.params.roomId;
  const room = gameService.getRoom(roomId);

  if (!room) {
    return rep.code(500).send({ message: 'Room not found' });
  }

  return rep.code(200).send({ message: 'Room info retrieved', data: room.roomInfos() });
}

export async function handlerEvent() {
  redisSub.subscribe('ws.game.in', (raw: string) => {
    const message = JSON.parse(raw);
    gameService.handleEvent(message.clientId, message.payload);
  })

  redisSub.subscribe('ws.broadcast.disconnect', (raw: string) => {
    const message = JSON.parse(raw);
    message;
    // gameService.deleteRoom(gameService.getRoom(message.clientId));
  })
}
