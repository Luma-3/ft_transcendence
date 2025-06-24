import { Room } from "./Room.js";
import { gameType } from "../../room/room.schema.js";
import { IPlayer } from "./Interface.js";
import { NotFoundError } from '@transcenduck/error'
import { IOInterface } from "../../utils/IOInterface.js";

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private playersInRooms: Map<string, Room> = new Map();

  public createRoom(game_name: string, type_game: gameType) {
    const room = new Room({ name: game_name, type_game: type_game });
    this.rooms.set(room.id, room);
    return room.id;
  }

  public removeRoom(id: string) {
    this.rooms.delete(id);
  }

  public joinRoom(player: IPlayer, id?: string) {
    if (id) {
      const room = this.rooms.get(id);
      if (!room) {
        throw new NotFoundError('room');
      }
      room.addPlayer(player);
      return room.id;
    }

    this.rooms.forEach(room => {
      if (room.isJoinable()) {
        room.addPlayer(player)
        return room.id;
      }
    });
    return undefined;
  }

  public leaveRoom(player: IPlayer, room_id: string) {
    // const room = this.rooms.get(room_id);
    room_id = room_id;
    // TODO :  room.removePlayer()
    this.playersInRooms.delete(player.user_id);
  }

  public findCurrentRoom(player: IPlayer) {
    return this.playersInRooms.get(player.user_id);
  }

  public getRoomById(room_id: string) {
    const room = this.rooms.get(room_id);
    if (!room) {
      throw new NotFoundError('room');
    }
    return room;
  }

  public startRoom(room_id: string) {
    const room = this.rooms.get(room_id);
    if (!room) {
      throw new NotFoundError('room');
    }
    // room.startGame(); // TODO : deplace la logique (shortcut for test)
  }
}

export const roomManagerInstance = new RoomManager
