import { UnauthorizedError } from '@transcenduck/error';

import { Player } from '../core/runtime/Player.js';
import { GameType } from './room.schema.js';

import { RoomManager } from '../core/runtime/RoomManager.js';
import { TournamentManager } from '../tournament/TournamentManager.js';
import { randomNameGenerator } from '../core/runtime/randomName.js';

export class RoomService {

  static async joinOrCreateRoom(
    gameName: string,
    gameType: GameType,
    userId: string,
    playerName?: string
  ) {
    let roomId = undefined;

    console.log("data", gameType);
    const player = await RoomService.createPlayer(userId, playerName);


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

    if (gameType === 'online') {
      // Case for joining an existing room with Matchmaking
      roomId = RoomManager.getInstance().joinRoom(player);
      if (!roomId) {
        roomId = RoomManager.getInstance().createRoom(gameName, gameType, false, playerName);
        RoomManager.getInstance().joinRoom(player, roomId);
      }
      return roomId;
    }

    roomId = RoomManager.getInstance().createRoom(gameName, gameType, true, playerName);
    RoomManager.getInstance().joinRoom(player, roomId);
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
    const room_id = RoomManager.getInstance().createRoom(randomNameGenerator(), 'online', true);
    RoomManager.getInstance().joinRoom(player, room_id);
    return room_id;
  }

  static async getRoomById(room_id: string) {
    const room = RoomManager.getInstance().getRoomById(room_id);
    return room;
  }
}
