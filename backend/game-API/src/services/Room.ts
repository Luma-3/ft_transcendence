import { v4 as uuidv4 } from 'uuid';
import { Pong } from '../game/Pong.js';
import { PlayerType } from '../schemas/Player.js';
import { GameType, RoomInfoType } from '../schemas/Room.js';

export class Room {
	id: string;
	name: string;
	typeGame: GameType;
	status: 'waiting' | 'roomReady' | 'readyToStart' | 'playing' | 'finished' = 'waiting';
	players: PlayerType[];
	pong: Pong | null;
	isFull: boolean;
	createdAt: Date;
	maxPlayers: number;
	playerReady: number;
	
  constructor(typeGame: GameType) {
		this.id = uuidv4();
		this.name = '';
		this.typeGame = typeGame;
		if (typeGame === 'localpvp' || typeGame === 'localpve') {
			this.status = 'readyToStart';
		}
		this.players = [];
		this.pong = null; // Instance of Pong game
		this.isFull = false;
		this.createdAt = new Date();
		this.maxPlayers = typeGame === 'tournament' ? 8 : typeGame === 'online' ? 2 : 1; // Maximum number of players in the room
		this.playerReady = 0; // Counter for players ready to start the game
  }

  addPlayer(player: PlayerType) {
		if (this.players.length >= this.maxPlayers) {
			return false;
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

	getPlayerById(playerId: string) {
		for (const player of this.players) {
	  		if (player.playerId === playerId) {
				return player; // Return the player if found
	  		}
		}
		return null; // Player not found
	}

  getPlayerByClientId(clientId: string) {
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

	this.pong = new Pong(
	  this.players[0].playerId,
	  this.players[1]?.playerId
	); // Optional player2_uid for single-player games

	if (!this.pong) {
	  return null; // Game creation failed
	}

	return this.pong; // Return the game instance
  }

  removePlayer(playerId: string) {
		//TODO: Implement player removal logic
		if (this.typeGame === 'localpvp' || this.typeGame === 'localpve') {
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

  setStatus(newStatus: 'waiting' | 'roomReady' | 'readyToStart' | 'playing' | 'finished') {
	this.status = newStatus;
  }

  isJoinable() { return (!this.isFull && this.status === 'waiting'); }

  isReadyToStart() { return (this.isFull || this.status === 'readyToStart'); }

  userInfos(player: PlayerType) {
	return {
		playerId: player.playerId,
		gameName: player.gameName,
		joined: player.joined
	};
  }

  userOpponentInfos(player: PlayerType) {
		return this.players.filter(p => p.playerId !== player.playerId).map(p => ({
			playerId: p.playerId,
			gameName: p.gameName,
			joined: p.joined
		}));
  }

  roomData() {
		return {
			roomId: this.id,
			gameData: this.pong ? this.pong.toJSON() : null,
			typeGame: this.typeGame,
			players: this.players,
			//opponents: this.userOpponentInfos(player)
		};
  }

  roomInfos() : RoomInfoType {
		return {
			roomId: this.id,
			typeGame: this.typeGame,
			players: this.players.map(player => ({
				playerId: player.playerId,
				gameName: player.gameName,
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
			playerId: player.playerId,
			gameName: player.gameName,
			ready: player.ready,
			})),
			isFull: this.isFull,
			createdAt: this.createdAt.toISOString(),
			maxPlayers: this.maxPlayers,
		};
  }
}
