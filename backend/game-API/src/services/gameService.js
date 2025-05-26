import { Pong } from '../game/Pong.js';

export class GameService {
  constructor() {
    this.games = new Map();
  }

  async createGame(player1_uid, player2_uid) {
    const game = new Pong(player1_uid, player2_uid);
    this.games.set(game.id, game);
    return game.id;
  }

  async handleEvent(clientId, event) {
    const game = Array.from(event.gameId);
    if (!game) {
      throw new Error('Game not found for the given client ID');
    }

    switch (event.type) {
      case 'move':
        game.movePlayer(clientId, event.payload.direction);
        break;
      default:
        throw new Error('Unknown event type');
    }
  }

  async deleteGame(gameId) {
    if (this.games.has(gameId)) {
      this.games.delete(gameId);
    }
  }
}
