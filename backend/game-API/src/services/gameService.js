import { redisPub } from '../config/redis.js';

import { fastify } from '../fastify.js';
import { Room } from './Room.js';
import { InternalServerError } from '@transcenduck/error'

class GameService {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(typeGame) {
    const room = new Room(typeGame);
    this.rooms.set(room.id, room);
    return room;
  }

  getRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null; // Room not found
    }
    return room;
  }

  addPlayerToRoom(roomId, player) {
    const room = this.getRoom(roomId);
    if (!room) {
      return false; // Room not found
    }

    return room.addPlayer(player);
  }

  joinRoom(player, typeGame) {
    let room = this.getRoom(this.findJoinableRoom(typeGame));
    console.log(this.findJoinableRoom(typeGame));
    if (!room) {
      room = this.createRoom(typeGame);
    }

    const success = room.addPlayer(player);
    if (!success) {
      return -1;
    }

    return room.id; // Return the ID of the room joined
  }

  findJoinableRoom(typeGame) {
    console.log('nb rooms : ', this.rooms.size);
    for (const room of this.rooms.values()) {
      if (room.typeGame === typeGame && room.isJoinable()) {
        console.log(`Joinable room found: ${room.id}`);
        return room.id; // Return the first joinable room found
      }
    }
    return -1;
  }

  createGameInRoom(roomId) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new InternalServerError('Room not found');
    }

    if (room.status !== 'readyToStart') {
      throw new InternalServerError('Room is not ready to start a game');
    }

    const game = room.createGame();
    if (!game) {
      throw new InternalServerError('Game creation failed');
    }
  }

  deleteRoom(roomId) {
    const room = getRoom(roomId);
    if (room) {
      room.stopGame();
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted`);
    } else {
      throw new InternalServerError('Room not found');
    }
  }

  async handleEvent(clientId, event) {
    console.log('handleEvent', event);
    const data = event.data;
    const roomId = data.roomId;
    const room = this.getRoom(roomId);
    console.log('room : ', room, 'roomId : ', roomId, 'clientId : ', clientId);
    if (!room) {
      throw new InternalServerError('Room not found for the given client ID');
    }

    switch (event.type) {

      case 'init':
        const player = room.getPlayerById(data.uid);
        if (!player) {
          throw new InternalServerError('Player not found in the room');
        }
        player.clientId = clientId;
        redisPub.publish('ws.game.out', JSON
          .stringify({
            clientId: player.clientId,
            payload: {
              action: 'init',
              data: {
                uid: player.uid,
                other_uids: room.players.filter(p => p.uid !== player.uid),
                roomId: room.id,
              },
            }
          }));
        break;

      case 'move':
        room.game.movePaddle(clientId, event.direction);
        break;
      default:
        throw new InternalServerError('Unknown event type');
    }
  }
}

//   createGame(player1_uid, player2_uid) {
//     const game = new Pong({ player1_uid, player2_uid });
//     this.games.set(game.id, game);
      
//     // Start the game immediately after creation
//     // this.startGame(game.id);

//     return game.id;
//   }

//   startGame(gameId) {
//     const game = this.games.get(gameId);

//     if (!game) {
//       throw new InternalServerError('Game not found');
//     }

//     // Start the game only if it is not already started
//     if (!game.gameIsStart) {
//       game.start();
//     } else {
//       throw new InternalServerError('Game is already started');
//     }
//   }

//   stopGame(gameId) {
//     const game = this.games.get(gameId);
//     if (!game) {
//       throw new InternalServerError('Game not found');
//     }

//     // Stop the game only if it is currently started
//     if (game.gameIsStart) {
//       game.stop();
//     } else {
//       throw new InternalServerError('Game is not started');
//     }
//   }

//   async handleEvent(clientId, event) {
//     const gameId = event.gameId;
//     const game = this.games.get(gameId);
//     if (!game) {
//       throw new InternalServerError('Game not found for the given client ID');
//     }

//     switch (event.type) {
//       case 'move':
//         game.movePlayer(clientId, event.direction);
//         break;
//       default:
//         throw new InternalServerError('Unknown event type');
//     }
//   }

//   getGameId(clientId) {
//     return this.games.get(clientId).id;
//   }

//   deleteGame(gameId) {
//     if (this.games.has(gameId)) {
//       this.stopGame(gameId);
//       this.games.delete(gameId);
//       console.log(`Game ${gameId} deleted`);
//     }
//   }
// }

export const gameService = new GameService(fastify);
