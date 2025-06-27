
import { ForbiddenError } from '@transcenduck/error';
import { Player } from '../core/runtime/Interface.js';
import { gameType } from './room.schema.js';

import { roomManagerInstance } from '../core/runtime/RoomManager.js';
// import { handleEvent } from './handleEvent.ts.old';

export class RoomService {

  static joinOrCreateRoom(player: Player, game_name: string, type_game: gameType) {
    let room_id = undefined;

    room_id = roomManagerInstance.joinRoom(player);
    if (!room_id) {
      room_id = roomManagerInstance.createRoom(game_name, type_game);
      roomManagerInstance.joinRoom(player, room_id);
    }
    return room_id;
  }

  static joinRoom(player: Player, room_id: string) {
    return roomManagerInstance.joinRoom(player, room_id);
  }

  static leaveCurrentRoom(player: Player) {
    const room = roomManagerInstance.findCurrentRoom(player);
    if (!room) {
      throw new ForbiddenError("Player isn't in a Room");
    }
    roomManagerInstance.leaveRoom(player, room.id);
  }

  static getRoomById(room_id: string) {
    const room = roomManagerInstance.getRoomById(room_id);
    return room;
  }
}

