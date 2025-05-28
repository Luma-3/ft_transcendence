import { v4 as uuidv4 } from 'uuid';
import { Pong } from '../game/Pong.js';

// interface Player {
// 	uid: string; // Unique identifier for the player
// 	clientId: string; // Client identifier
// 	gameName: string; // Name of the game or player
// }

export class Room {
  constructor(typeGame) {
	this.id = uuidv4();
	this.name = ''; // Unique name for the room
	this.typeGame = typeGame; // 'localpvp', 'localpve', 'online', 'tournament' 
	this.status = typeGame === ('localpvp' || 'localpve') ? 'readyToStart' : 'waiting'; // 'waiting', 'readyToStart', 'playing', 'finished'
	this.players = [];
	this.pong = null; // Instance of Pong game
	this.isFull = false;
	this.createdAt = new Date();
	this.maxPlayers = typeGame === 'tournament' ? 8 : 2; // Maximum number of players in the room
  }

  addPlayer(player) {
	if (this.players.length >= this.maxPlayers) {
	  return false; // Room is full
  	}

	this.players.push(player);
	if (this.players.length === this.maxPlayers) {
		this.isFull = true; // Room is now full
		this.status = 'readyToStart';
		//TODO: Notify players that the room is ready to start
	}

	if (this.name === '') {
	  this.name = `Room-${player.gameName}`; // Assign a unique name if not set
	}
	return true; // Player added successfully
  }

	getPlayerById(playerId) {
		for (const player of this.players) {
	  		if (player.uid === playerId) {
				return player; // Return the player if found
	  		}
		}
		return null; // Player not found
	}

  createGame() {
	if (this.status !== 'readyToStart') {
	  return null; // Cannot create game if not ready
	}

	this.pong = new Pong({
	  player1_uid: this.players[0].uid,
	  player2_uid: this.players[1]?.uid}); // Optional player2_uid for single-player games
	
	if (!this.pong) {
	  return null; // Game creation failed
	}
	//TODO: Notify players that the game is created and started
	this.pong.start(); // Start the Pong game
	this.status = 'playing';
	return this.pong; // Return the Pong game instance
  }

  removePlayer(playerId) {
	//TODO: Implement player removal logic
  }

  stopGame() {
	if (this.pong) {
	  this.pong.stop(); // Stop the Pong game
	  this.pong = null; // Clear the game instance
	  this.status = 'finished'; // Update room status
	  this.isFull = false; // Reset full status
	}
  }

  setStatus(newStatus) { this.status = newStatus; }

  isJoinable() { return (!this.isFull && this.status === 'waiting'); }

  isReadyToStart() { return (this.isFull && this.status === 'readyToStart'); }

  usersInfos() {
	return {
	  id: this.id,
	  players: this.players.map(player => ({
		uid: player.uid,
		gameName: player.gameName
	  })),
    };
  }

  toJSON() {
    return {
	  id: this.id,
	  name: this.name,
	  typeGame: this.typeGame,
	  status: this.status,
	  players: this.players.map(player => ({
		uid: player.uid,
		gameName: player.gameName
	  })),
	  isFull: this.isFull,
	  createdAt: this.createdAt.toISOString(),
	  maxPlayers: this.maxPlayers,
	};
  }
}

//   createGame(player1_uid, player2_uid) {
// 	const game = new Pong({ player1_uid, player2_uid });
// 	this.games.set(game.id, game);
	  
// 	// Start the game immediately after creation
// 	// this.startGame(game.id);

// 	return game.id;
//   }

//   startGame(gameId) {
// 	const game = this.games.get(gameId);

// 	if (!game) {
// 	  throw new InternalServerError('Game not found');
// 	}

// 	// Start the game only if it is not already started
// 	if (!game.gameIsStart) {
// 	  game.start();
// 	} else {
// 	  throw new InternalServerError('Game is already started');
// 	}
//   }

//   stopGame(gameId) {
// 	const game = this.games.get(gameId);
// 	if (!game) {
// 	  throw new InternalServerError('Game not found');
// 	}

// 	// Stop the game only if it is currently started
// 	if (game.gameIsStart) {
// 	  game.stop();
// 	} else {
// 	  throw new InternalServerError('Game is not started');
// 	}
//   }

//   async handleEvent(clientId, event) {
// 	const gameId = event.gameId;
// 	const game = this.games.get(gameId);
// 	if (!game) {
// 	  throw new InternalServerError('Game not found for the given client ID');
// 	}

// 	switch (event.type) {
// 	  case 'move':
// 		game.movePlayer(clientId, event.direction);
// 		break;
// 	  default:
// 		throw new InternalServerError('Unknown event type');
// 	}
//   }

//   getGameId(clientId) {
// 	return this.games.get(clientId).id;
//   }

//   deleteGame(gameId) {
// 	if (this.games.has(gameId)) {
// 	  this.stopGame(gameId);
// 	  this.games.delete(gameId);
// 	  console.log(`Game ${gameId} deleted`);
// 	}
//   }
