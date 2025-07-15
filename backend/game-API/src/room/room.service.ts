
import { ForbiddenError } from '@transcenduck/error';
import { Player } from '../core/runtime/Player.js';
import { GameType } from './room.schema.js';

import { roomManagerInstance } from '../core/runtime/RoomManager.js';
import { UnauthorizedError } from '@transcenduck/error';

export class RoomService {

  static async joinOrCreateRoom(
    gameName: string,
    gameType: GameType,
    userId: string,
    playerName?: string,
    privateRoom: boolean = false,
    userIdInvited: string = undefined
  ) {
    let roomId = undefined;

    // Case for private room with an invited user
    if (privateRoom && userIdInvited && gameType === 'online') {
      roomId = roomManagerInstance.createRoom(gameName, gameType, privateRoom);
      await RoomService.joinRoom(userIdInvited, playerName, roomId);
      return roomId;
      // TODO: Insert Invitation logic
    }

    // Case for joining an existing room with Matchmaking
    roomId = await RoomService.joinRoom(userId, playerName);

    // If no room was found, create a new one
    if (!roomId) {
      roomId = roomManagerInstance.createRoom(gameName, gameType);
      await RoomService.joinRoom(userId, undefined, roomId);
    }
    return roomId;
  }

  static async joinRoom(userId: string, playerName?: string, roomId?: string) {

    const response = await fetch(`http://${process.env.USER_IP}/users/${userId}?includePreferences=true`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new UnauthorizedError(`Failed to fetch player info for ${userId}`);
    }

    const user = await response.json();

    const player = new Player(userId, (user) ? user.data.username : playerName ?? 'Anonymous');
    player.avatar = user.data.preferences.avatar;

    return roomManagerInstance.joinRoom(player, roomId);
  }

  static async createPrivateRoom(player: Player) {
    const room_id = roomManagerInstance.createRoom(player.id, 'online', true);
    roomManagerInstance.joinRoom(player, room_id);
    return room_id;
  }

  static async leaveCurrentRoom(player: Player) {
    const room = roomManagerInstance.findCurrentRoom(player);
    if (!room) {
      throw new ForbiddenError("Player isn't in a Room");
    }
    roomManagerInstance.leaveRoom(player, room.id);
  }

  static async getRoomById(room_id: string) {
    const room = roomManagerInstance.getRoomById(room_id);
    return room;
  }
}

