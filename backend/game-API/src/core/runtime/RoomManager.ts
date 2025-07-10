import { Room } from "./Room.js";
import { gameType } from "../../room/room.schema.js";
import { Player } from "./Interface.js";
import { NotFoundError } from '@transcenduck/error'

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

  public joinRoom(player: Player, id?: string) {
    if (this.playersInRooms.has(player.id)) {
      throw new Error(`Player ${player.id} is already in a room`);
    }

    if (id) {
      const room = this.rooms.get(id);
      if (!room) {
        throw new NotFoundError('room');
      }
      console.log(`Player ${player.id} joining room ${id}`);
      room.addPlayer(player);
      this.playersInRooms.set(player.id, room);
      return room.id;
    }

    this.rooms.forEach(room => {
      if (room.isJoinable()) {
        room.addPlayer(player)
        this.playersInRooms.set(player.id, room);
        return room.id;
      }
    });
    return undefined;
  }

  public leaveRoom(player: Player, room_id: string) {
    // const room = this.rooms.get(room_id);
    room_id = room_id;
    // TODO :  surement util pour le cas ou le joueur quitte la room (a modifier pour que la room soit supprimee par la suite)
    this.playersInRooms.delete(player.id);
  }

  public findCurrentRoom(player: Player) {
    return this.playersInRooms.get(player.id);
  }

  public getRoomById(room_id: string) {
    const room = this.rooms.get(room_id);
    if (!room) {
      throw new NotFoundError('room');
    }
    return room;
  }

  public deleteRoom(room_id: string) {
    if (!this.rooms.has(room_id)) {
      throw new NotFoundError('room');
    }
    this.rooms.delete(room_id);

    this.playersInRooms.forEach((room, playerId) => {
      if (room.id === room_id) {
        this.playersInRooms.delete(playerId);
      }
    });
  }
}

export const roomManagerInstance = new RoomManager
