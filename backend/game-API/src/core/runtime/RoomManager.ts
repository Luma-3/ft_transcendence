import { EventEmitter } from "node:events";
import { NotFoundError, ConflictError } from '@transcenduck/error'

import { Room } from "./Room.js";
import { GameType } from "../../room/room.schema.js";
import { Player } from "./Player.js";

export class RoomManager {
  private static instance: RoomManager;

  private rooms: Map<string, Room> = new Map();
  private playersInRooms: Map<string, Room> = new Map();
  private eventEmitter = new EventEmitter();

  private constructor() {
    this.eventEmitter.on('room:end', this.stopRoom.bind(this));
    this.eventEmitter.on('room:error', (roomId: string) => {
      console.error(`Error in room ${roomId}`);
      this.stopRoom(roomId);
    });
    this.eventEmitter.on('room:playerleft', (roomId: string) => {
      console.log(`Player left room ${roomId}`);
      this.stopRoom(roomId);
    });
  }
  
  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public stopRoom (roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
  
    room.stop()
    this.rooms.delete(roomId);
    
    this.playersInRooms.forEach((room, playerId) => {
      if (room.id === roomId) {
        this.playersInRooms.delete(playerId);
      }
    })
  }

  public emit(event: string, ...args: any[]) {
    this.eventEmitter.emit(event, ...args);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }

  public createRoom(game_name: string,
    type_game: GameType,
    privateRoom: boolean = false,
    localPlayerName?: string
  ): string {

    const room = new Room({
      name: game_name,
      type_game: type_game,
      privateRoom: privateRoom,
      localPlayerName: localPlayerName
    });

    this.rooms.set(room.id, room);
    return room.id;
  }

  public joinRoom(player: Player, id?: string) {
    if (this.playersInRooms.has(player.id)) {
      throw new ConflictError(`Player ${player.id} is already in a room`);
    }

    if (id) {
      const room = this.rooms.get(id);
      if (!room) throw new NotFoundError('room');

      console.log(`Player ${player.id} joining room ${id}`);
      room.addPlayer(player);
      this.playersInRooms.set(player.id, room);
      return room.id;
    }

    this.rooms.forEach(room => {
      if (room.isJoinable()) {
        room.addPlayer(player);
        this.playersInRooms.set(player.id, room);
        return room.id;
      }
    });
    return undefined;
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
}
