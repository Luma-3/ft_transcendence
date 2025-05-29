import { redisPub } from '../config/redis.js';

import { fastify } from '../fastify.js';
import { Room } from './Room.js';
import { InternalServerError } from '@transcenduck/error';

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
    for (const room of this.rooms.values()) {
      if (room.typeGame === typeGame && room.isJoinable()) {
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
    console.log('Game created in room:', roomId, 'Game:', game);
    if (!game) {
      throw new InternalServerError('Game creation failed');
    }
    
    if (room.typeGame === 'localpve') {
      // If the game is a local player vs. environment (PVE) game, set it to be against a bot
      game.isAgainstBot = true;
      console.log('Game is set to be against a bot\nGame :', game);
    }
  }

  deleteRoom(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      room.stopGame();
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted`);
    } else {
      //throw new InternalServerError('Room not found');
    }
  }

  async handleEvent(clientId, event) {
    const data = event.data;
    const roomId = data.roomId;
    const room = this.getRoom(roomId);
    if (!room) {
      //console.error(`Room not found for clientId: ${clientId}, roomId: ${roomId}`);
      return;
      // throw new InternalServerError('Room not found for the given client ID');
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
                opponents: room.players.filter(p => p.uid !== player.uid),
                roomId: room.id,
              },
            }
          }));
          if (room.isReadyToStart()) {
          for (const p of room.players) {
            redisPub.publish('ws.game.out', JSON
              .stringify({
                clientId: p.clientId,
                payload: {
                  action: 'gameReady',
                }
              })
            );
          }
        }
        break;

      case 'startGame':
        room.playerReady++;
        if (room.playerReady === room.maxPlayers) this.createGameInRoom(roomId);
        break;

      case 'move':
        let whois = room.getPlayerByClientId(clientId);
        if (!whois) {
          return ;
        }
        
        if (!room.pong) {
          console.error(`Pong game not found in room ${roomId}`);
          return ;
        }
        room.pong.movePaddle(whois.uid, data.direction);
        
        if (room.typeGame === 'localpvp') {
          room.pong.movePaddle("", data.direction2);
        }
        break;
      default:
        throw new InternalServerError('Unknown event type');
    }
  }

  // leaveRoom(roomId, playerId) {
  //   const room = this.getRoom(roomId);
  //   if (!room) {
  //     throw new InternalServerError('Room not found');
  //   }
  //   const playerIndex = room.players.findIndex(p => p.uid === playerId);
  //   if (playerIndex === -1) {
  //     throw new InternalServerError('Player not found in the room');
  //   }
  //   room.players.splice(playerIndex, 1);
  //   if (room.players.length === 0) {
  //     this.deleteRoom(roomId); // Delete the room if no players left
  //   } else if (room.players.length < room.maxPlayers) {
  //     room.isFull = false; // Room is no longer full
  //     room.status = 'waiting'; // Change status to waiting
  //   }
  //   console.log(`Player ${playerId} left room ${roomId}`);
  //   return roomId; // Return the ID of the room left
  // }
}

export const gameService = new GameService(fastify);
