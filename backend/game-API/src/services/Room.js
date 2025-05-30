import { v4 as uuidv4 } from 'uuid';
import { Pong } from '../game/Pong.js';

// interface Player {
// 	uid: string; // Unique identifier for the player
// 	clientId: string; // Client identifier
// 	gameName: string; // Name of the game or player
// 	// Additional player properties can be added here
//  ready: boolean; // Indicates if the player is ready to start the game
// }

export class Room {
  constructor(typeGame) {
	this.id = uuidv4();
	this.name = ''; // Unique name for the room
	this.typeGame = typeGame; // 'localpvp', 'localpve', 'online', 'tournament' 
	this.status = typeGame === ('localpvp' || 'localpve') ? 'readyToStart' : 'waiting'; // 'waiting', 'roomReady', 'readyToStart', 'playing', 'finished'
	this.players = [];
	this.pong = null; // Instance of Pong game
	this.isFull = false;
	this.createdAt = new Date();
	this.maxPlayers = typeGame === 'tournament' ? 8 : typeGame === 'online' ? 2 : 1; // Maximum number of players in the room
	this.playerReady = 0; // Counter for players ready to start the game
  }

  addPlayer(player) {
	if (this.players.length >= this.maxPlayers) {
	  return false; // Room is full
  	}

	this.players.push(player);
	if (this.players.length === this.maxPlayers) {
		this.isFull = true; // Room is now full
		this.status = 'roomReady'; // Change status to ready to start
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

  getPlayerByClientId(clientId) {
	for (const player of this.players) {
	  if (player.clientId === clientId) {
		return player; // Return the player if found
	  }
	}
	return null; // Player not found
  }

  createGame() {
	// if (this.status !== 'readyToStart') {
	//   return null; // Cannot create game if not ready
	// }

	this.pong = new Pong({
	  player1_uid: this.players[0].uid,
	  player2_uid: this.players[1]?.uid
	}); // Optional player2_uid for single-player games

	if (!this.pong) {
	  return null; // Game creation failed
	}

	return this.pong; // Return the game instance
  }

  removePlayer(playerId) {
	//TODO: Implement player removal logic
	if (this.typeGame === ("localpvp" || "localpve")) {
	  this.stopGame(); // Stop the game if it's a local PvP or PvE game
	}
  }

  startGame() {
	if (!this.pong) {
		return false; // Cannot start game if not created
	}
	this.pong.start(); // Start the Pong game
	this.status = 'playing'; // Update room status to playing
	return true; // Game started successfully
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

  isReadyToStart() { return (this.isFull || this.status === 'readyToStart'); }

  userInfos(player) {
	return {
		playerId: player.uid,
		gameName: player.gameName,
		joined: player.joined
	};
  }

  userOpponentInfos(player) {
	return this.players.filter(p => p.uid !== player.uid).map(p => ({
		playerId: p.uid,
		gameName: p.gameName,
		joined: p.joined
	}));
  }

  roomData(player) {
	return {
		roomId: this.id,
		gameData: this.pong ? this.pong.toJSON() : null,
		typeGame: this.typeGame,
		self: this.userInfos(player),
		opponents: this.userOpponentInfos(player)
	};
  }

  roomInfos() {
	return {
	  roomId: this.id,
	  typeGame: this.typeGame,
	  players: this.players.map(player => ({
		playerId: player.uid,
		gameName: player.gameName,
		ready: player.ready
	  })),
    };
  }

  toJSON() {
    return {
	  roomId: this.id,
	  name: this.name,
	  typeGame: this.typeGame,
	  status: this.status,
	  players: this.players.map(player => ({
		playerId: player.uid,
		gameName: player.gameName,
		ready: player.ready,
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
