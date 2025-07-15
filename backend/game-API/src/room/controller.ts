import { FastifyReply, FastifyRequest } from "fastify";
import { RoomBodyType, RoomParamIdType, RoomParamType, HeaderBearerType, RoomQueryType, RoomParamUserIdType } from "./room.schema.js";
import { RoomService } from "./room.service.js";
import { RoomModelInstance } from "./model.js";


export async function PostRoomHandler(
  req: FastifyRequest<{ Body: RoomBodyType, Params: RoomParamType, Querystring: RoomQueryType, Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { roomType } = req.params;
  const { roomName, playerName } = req.body;
  const userId = req.headers['x-user-id'] as string;
  const { privateRoom, userIdInvited } = req.query

  const roomId = await RoomService.joinOrCreateRoom(
    roomName,
    roomType,
    userId,
    playerName,
    privateRoom,
    userIdInvited
  );

  return rep.code(201).send({
    message: 'Room created or joined successfully',
    data: { id: roomId }
  });
}

export async function PostRoomIdHandler(
  req: FastifyRequest<{ Body: RoomBodyType, Params: RoomParamIdType, Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { roomId } = req.params;
  const userId = req.headers['x-user-id'] as string;

  const joinedRoomId = await RoomService.joinRoom(userId, undefined, roomId);

  return rep.code(200).send({
    message: 'Player joined the room successfully',
    data: { id: joinedRoomId }
  });
}

export async function GetRoomsHandler(
  req: FastifyRequest<{ Params: RoomParamUserIdType, Headers: HeaderBearerType }>, rep: FastifyReply
) {
  const { userId } = req.params;

  const rooms = await RoomModelInstance.findByID(userId)
  console.log(rooms);

  return rep.code(200).send({
    message: 'OK',
    data: {rooms : rooms}
  });
}
