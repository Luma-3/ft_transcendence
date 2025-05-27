import { fastify } from '../fastify.js';
import { Pong } from '../game/Pong.js';
import { InternalServerError } from '@transcenduck/error'

class GameService {
  constructor() {
    this.games = new Map();
  }

  async createGame(player1_uid, player2_uid) {
    const game = new Pong({ player1_uid, player2_uid });
    // console.log("Game created", game);
    this.games.set(game.id, game);
    
    // Start the game immediately after creation
    this.startGame(game.id);

    return game.id;
  }

  async startGame(gameId) {
    const game = this.games.get(gameId);

    if (!game) {
      throw new InternalServerError('Game not found');
    }

    // Start the game only if it is not already started
    if (!game.gameIsStart) {
      console.log(`
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        Game ${gameId} started
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        `);
      game.start();
    } else {
      throw new InternalServerError('Game is already started');
    }
  }

  async stopGame(gameId) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new InternalServerError('Game not found');
    }

    // Stop the game only if it is currently started
    if (game.gameIsStart) {
      console.log(`
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        Game ${gameId} stopped
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        `);
      game.stop();
    } else {
      throw new InternalServerError('Game is not started');
    }
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
      this.stopGame(gameId);
      this.games.delete(gameId);
      console.log(`Game ${gameId} deleted`);
    }
  }
}

export const gameService = new GameService(fastify);
