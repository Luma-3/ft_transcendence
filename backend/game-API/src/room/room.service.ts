import { UnauthorizedError, NotFoundError, ConflictError } from '@transcenduck/error';

import { Player } from '../core/runtime/Player.js';
import { GameType } from './room.schema.js';

import { RoomManager } from '../core/runtime/RoomManager.js';
import { TournamentManager } from '../tournament/TournamentManager.js';
import { randomNameGenerator } from '../core/runtime/randomName.js';
import { RoomModelInstance } from './model.js';

export class RoomService {

  static async joinOrCreateRoom(
    gameName: string,
    gameType: GameType,
    userId: string,
    playerName?: string
  ) {
    let roomId = undefined;

    const player = await RoomService.createPlayer(userId, playerName);


    if (gameType === 'tournament') {
      let tournamentId = undefined;
      tournamentId = TournamentManager.getInstance().joinTournament(player);

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

  static async findPlayer(userId: string, roomType: string) {
    const tmpPlayer = await this.createPlayer(userId);

    if (roomType === 'online') {
      const room = RoomManager.getInstance().findCurrentRoom(tmpPlayer);
      if (room === undefined) {
        throw new NotFoundError('User');
      }
      if (!room.isJoinable()) {
        throw new ConflictError('User is playing');
      }
    } else if (roomType === 'tournament') {
      const tournament = TournamentManager.getInstance().findCurrentTournament(tmpPlayer);
      if (tournament === undefined) {
        throw new NotFoundError('User');
      }
      if (!tournament.isJoinable()) {
        throw new ConflictError('User is playing');
      }
    }
  }

  static async removePlayer(userId: string, roomType: string) {
    const tmpPlayer = await this.createPlayer(userId);
    if (roomType === 'online') {
      const room = RoomManager.getInstance().findCurrentRoom(tmpPlayer);
      if (room === undefined) {
        throw new NotFoundError('User');
      }
      if (room.getStatus() !== 'waiting') {
        throw new ConflictError('User is playing');
      }
      RoomManager.getInstance().stopRoom(room.id, false);
    } else if (roomType === 'tournament') {
      const tournament = TournamentManager.getInstance().findCurrentTournament(tmpPlayer);
      if (tournament === undefined) {
        throw new NotFoundError('User');
      }
      if (tournament.getStatus() !== 'waiting') {
        throw new ConflictError('User is playing');
      }
      TournamentManager.getInstance().removePlayer(tmpPlayer);
    }
  }

  static async getRank(userId: string) {
    const kd_stats = await RoomModelInstance.getKDStats(userId);

    if (!kd_stats) {
      throw new NotFoundError('User KD stats not found');
    }

    const rank = Math.abs(kd_stats.wins / kd_stats.total_games * (1 - Math.pow(2.71828, kd_stats.total_games / 10)));
    return {
      wins: kd_stats.wins,
      losses: kd_stats.losses,
      total_games: kd_stats.total_games,
      rank: rank
    };
  }

  static async addRank(userId: string, win_loss: 'win' | 'loss') {
    const stats = await RoomModelInstance.getKDStats(userId);
    if (!stats) {
      // If stats do not exist, create them with initial values
      return await RoomModelInstance.addKDStats(userId, win_loss === 'win' ? 1 : 0, win_loss === 'loss' ? 1 : 0);
    }

    if (win_loss === 'win') {
      stats.wins += 1;
    } else {
      stats.losses += 1;
    }
    stats.total_games = stats.wins + stats.losses;

    return await RoomModelInstance.addKDStats(userId, stats.wins, stats.losses);
  }

}
