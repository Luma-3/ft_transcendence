import { redisPub } from '../utils/redis.js';

import { Room } from './Room.js';
import { Player } from '../interfaces/Player.js';
import { InternalServerError } from '@transcenduck/error';

class GameService {
  rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  broadcast(roomId: string, action: string, data: any) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new InternalServerError('Room not found');
    }

    for (const player of room.players) {
      if (player.clientId) {
        redisPub.publish('ws.game.out', JSON.stringify({
          clientId: player.clientId,
          payload: { action: action, data: data }
        }));
      }
    }
  }

  createRoom(typeGame: string) {
    const room = new Room(typeGame);
    this.rooms.set(room.id, room);
    return room;
  }

  getRoom(roomId: string) {
    if (roomId === "") {
      return null;
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      return null; // Room not found
    }
    return room;
  }

  addPlayerToRoom(roomId: string, player: Player) {
    const room = this.getRoom(roomId);
    if (!room) {
      return false; // Room not found
    }

    let status = room.addPlayer(player);

    if (room.status === 'roomReady') {
      this.broadcast(roomId, 'roomReady', room.roomData());
    }

    return status;
  }

  joinRoom(player: Player, typeGame: string) {
    let roomId = this.findJoinableRoom(typeGame);
    let room = this.getRoom(roomId !== null ? roomId : "");
    if (!room) {
      room = this.createRoom(typeGame);
    }

    const success = this.addPlayerToRoom(room.id, player);
    if (!success) {
      return null;
    }

    return room.id; // Return the ID of the room joined
  }

  findJoinableRoom(typeGame: string) {
    for (const room of this.rooms.values()) {
      if (room.typeGame === typeGame && room.isJoinable()) {
        return room.id; // Return the first joinable room found
      }
    }
    return null;
  }

  createGameInRoom(roomId: string) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new InternalServerError('Room not found');
    }

    if (room.status !== 'readyToStart') {
      // throw new InternalServerError('Room is not ready to start a game');
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

  deleteRoom(roomId: string) {
    const room = this.getRoom(roomId);
    if (room) {
      room.stopGame();
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted`);
    } else {
      //throw new InternalServerError('Room not found');
    }
  }

  //TODO: faire en sorte que les players set le ready a true et le renvoie au front
  async handleEvent(clientId: string, event: { type: string, data: any }) {
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
        const player = room.getPlayerById(data.playerId);
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
                roomId: room.id,
                playerId: player.playerId,
              },
            }
          }));
          if (room.status === 'roomReady') {
            console.log("room data :", room.roomData());
            this.broadcast(roomId, 'roomReady', room.roomData());
          }
        break;

      case 'playerJoin':
        const playerJoin = room.getPlayerByClientId(clientId);
        console.log('Joined: ', playerJoin);
        if (!playerJoin) {
          //throw new InternalServerError('Player not found in the room');
          return;
        }

        playerJoin.joined = true;
        this.broadcast(roomId, 'playerJoin', room.roomData());
        break;

      case 'playerReady':
        const playerReady = room.getPlayerByClientId(clientId);
        console.log('is ready: ', playerReady);
        if (!playerReady) {
          //throw new InternalServerError('Player not found in the room');
          return;
        }

        playerReady.ready = true;

        room.playerReady++;
        if (room.isReadyToStart()) {
          room.status = 'readyToStart';
          this.createGameInRoom(roomId);
          this.broadcast(roomId, 'readyToStart', room.roomData());
        }
      
      case 'startGame':
        if (room.status === 'readyToStart')
          if (room.startGame() === false)
            throw new InternalServerError('Game start failed');
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

export const gameService = new GameService();
