import { FastifyReply, FastifyRequest } from "fastify";

import { RoomManager } from "../core/runtime/RoomManager.js";
import { RoomBodyType, RoomParamIdType, RoomParamType, HeaderBearerType, /* RoomQueryType, */ RoomParamUserIdType } from "./room.schema.js";
import { RoomService } from "./room.service.js";
import { RoomModelInstance } from "./model.js";


export async function PostRoomHandler(
  req: FastifyRequest<{ Body: RoomBodyType, Params: RoomParamType,/*  Querystring: RoomQueryType, */ Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { roomType } = req.params;
  const { roomName, playerName } = req.body;
  const userId = req.headers['x-user-id'] as string;

  const roomId = await RoomService.joinOrCreateRoom(
    roomName,
    roomType,
    userId,
    playerName
  );

  return rep.code(201).send({
    message: 'Room created or joined successfully',
    data: { id: roomId }
  });
}

export async function GetRoomHandler(
  req: FastifyRequest<{ Headers: HeaderBearerType, Params: RoomParamType }>, rep: FastifyReply
) {
  const { roomType } = req.params;
  const user_id = req.headers['x-user-id'] as string;

  await RoomService.findPlayer(user_id, roomType);

  return rep.code(200).send({
    message: 'Player is waiting for a match'
  });
}

export async function DeleteRoomHandler(
  req: FastifyRequest<{ Headers: HeaderBearerType, Params: RoomParamType }>, rep: FastifyReply
) {
  const { roomType } = req.params;
  const user_id = req.headers['x-user-id'] as string;

  await RoomService.removePlayer(user_id, roomType);

  return rep.code(200).send({
    message: 'Player is waiting for a match'
  });
}

export async function PostRoomIdHandler(
  req: FastifyRequest<{ Body: RoomBodyType, Params: RoomParamIdType, Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { roomId } = req.params;
  const userId = req.headers['x-user-id'] as string;

  const player = await RoomService.createPlayer(userId);
  const joinedRoomId = RoomManager.getInstance().joinRoom(player, roomId);

  return rep.code(200).send({
    message: 'Player joined the room successfully',
    data: { id: joinedRoomId }
  });
}

export async function GetRoomsHandler(
  req: FastifyRequest<{ Params: RoomParamUserIdType, Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { userId } = req.params;

  const rooms = await RoomModelInstance.findByID(userId);

  return rep.code(200).send({
    message: 'OK',
    data: { rooms: rooms }
  });
}

export async function GetKDStatsHandler(
  req: FastifyRequest<{ Params: RoomParamUserIdType }>, rep: FastifyReply
) {
  const { userId } = req.params;

  const kdStats = await RoomService.getRank(userId);
  return rep.code(200).send({
    message: 'OK',
    data: kdStats
  });
}
