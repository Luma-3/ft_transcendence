import { UnauthorizedError } from '@transcenduck/error';

import { Player } from '../core/runtime/Player.js';
import { GameType } from './room.schema.js';

import { RoomManager } from '../core/runtime/RoomManager.js';
import { IOInterface } from '../utils/IOInterface.js';
import { TournamentManager } from '../tournament/TournamentManager.js';

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

    console.log("data", privateRoom, userIdInvited, gameType);
    const player = await RoomService.createPlayer(userId, playerName);

    // Case for private room with an invited user
    if (privateRoom && userIdInvited && gameType === 'online') {
      roomId = RoomManager.getInstance().createRoom(gameName, gameType, privateRoom);
      RoomManager.getInstance().joinRoom(player, roomId);
      IOInterface.send(
        JSON.stringify({ action: 'invitation', data: { roomId } }),
        userIdInvited
      );
      return roomId;
    }

    if (gameType === 'tournament') {
      let tournamentId = undefined;
      console.log(`instance => `, TournamentManager.getInstance())
      tournamentId = TournamentManager.getInstance().joinTournament(player);

      console.log(`tournamentId: ${tournamentId}`);
      if (!tournamentId) {
        tournamentId = TournamentManager.getInstance().createTournament();
        TournamentManager.getInstance().joinTournament(player, tournamentId);
      }
      return tournamentId;
    }

    // Case for joining an existing room with Matchmaking
    roomId = RoomManager.getInstance().joinRoom(player);

    // If no room was found, create a new one
    if (!roomId) {
      roomId = RoomManager.getInstance().createRoom(gameName, gameType, false, playerName);
      RoomManager.getInstance().joinRoom(player, roomId);
    }
    return roomId;
  }

  static async createPlayer(userId: string, playerName?: string) {
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

    return player;
  }

  static async createPrivateRoom(player: Player) {
    const room_id = RoomManager.getInstance().createRoom(player.id, 'online', true);
    RoomManager.getInstance().joinRoom(player, room_id);
    return room_id;
  }

  static async getRoomById(room_id: string) {
    const room = RoomManager.getInstance().getRoomById(room_id);
    return room;
  }
}
