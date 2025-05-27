import { fastify } from '../fastify.js';
import { Pong } from '../game/Pong.js';
import { InternalServerError } from '@transcenduck/error'

class GameService {
  constructor() {
    this.games = new Map();
  }

  async createGame(player1_uid, player2_uid) {
    const game = new Pong({ player1_uid, player2_uid });
    console.log("Game created", game);
    this.games.set(game.id, game);
    game.start();
    return game.id;
  }

  async handleEvent(clientId, event) {
    const gameId = event.gameId;
    const game = this.games.get(gameId);
    if (!game) {
      throw new InternalServerError('Game not found for the given client ID');
    }

    switch (event.type) {
      case 'move':
        game.movePlayer(clientId, event.direction);
        break;
      default:
        throw new InternalServerError('Unknown event type');
    }
  }

  async getGame(clientId) {
    for (const game of this.games.values()) {
      if (game.player1.uid === clientId || game.player2.uid === clientId) {
        return game;
      }
    }
    throw new InternalServerError('Game not found for the given client ID');
  }

  async getGameId(clientId) {
    return this.getGame(clientId).id;
  }

  async deleteGame(gameId) {
    if (this.games.has(gameId)) {
      this.games.delete(gameId);
    }
  }
}

export const gameService = new GameService(fastify);
