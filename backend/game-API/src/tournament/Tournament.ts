import { v4 as uuidv4 } from 'uuid';

import { Player } from "../core/runtime/Player";
import { IOInterface } from '../utils/IOInterface';
import { roomManagerInstance } from '../core/runtime/RoomManager';
import { RoomService } from '../room/room.service';

type StatusType = 'waiting' | 'playing' | 'finished';

function shuffle(array: Player[]) {
	let shuffled = array;
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

	return shuffled;
}

export class Tournament {
	private readonly id : string;
	
	private players: Player[] = [];
	private playerTournament: Player[] = [];
	private activeMatches: Map<string, Player[]> = new Map();
	private winners: Player[] = [];

	private status: StatusType = 'waiting';

	constructor() {
		this.id = uuidv4();

		IOInterface.subscribe(`ws:all:broadcast:all`, this.error.bind(this));
		IOInterface.subscribe(`ws:all:broadcast:all`, this.deconnexion.bind(this));
	}

	isJoinable(): boolean { return this.status === 'waiting'; }

	nbPlayers(): number { return this.players.length; }

	async addPlayer(player: Player) {
		this.players.push(player);

		IOInterface.send(
      JSON.stringify({ action: 'joined', data: this.toJSON() }),
      player.id
    ); // Notify the player who joined

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerJoined', data: this.toJSON() }),
      this.players.map((value) => value.id)
    ); // Notify all players in the room
	}

	start() {
		this.playerTournament = this.players;
		this.NextRound(this.playerTournament);
	}

	NextRound (players: Player[]) {
		const pairs = this.createPairs(players);
		pairs.forEach(async ([p1, p2]) => {
			const roomId = roomManagerInstance.createRoom('mma in the pound', 'tournament', true);
			await Promise.all([
				RoomService.joinRoom(p1.id, p1.player_name, roomId),
				RoomService.joinRoom(p2.id, p2.player_name, roomId)
			]);
			this.activeMatches.set(roomId, [p1, p2]);
		})

		roomManagerInstance.RoomEmitter.on('endGame', (roomId, winner) => {
			this.endRoom(roomId, winner);
		})
	}

	endRoom(roomId: string, winner: Player) {
		this.activeMatches.delete(roomId);
		this.winners.push(winner);

		if (this.activeMatches.size === 0) {
			if (this.winners.length === 1) {
				//TODO : call winner
				return ;
			}
			this.playerTournament = [...this.winners];
			this.winners = [];
			this.NextRound(this.playerTournament);
		}
	}

	createPairs(players: Player[]): [Player, Player][] {
		const shuffled = shuffle(players);
		const pairs: [Player, Player][] = [];

		for (let i = 0; shuffled.length; i += 2) {
			if (i + 1 < shuffled.length) {
				pairs.push([shuffled[i], shuffled[i + 1]]);
			}
			else {
				this.winners.push(shuffled[i]);
			}
		}

		return pairs;
	}

	error(message: string) {
		const { type, user_id, payload } = JSON.parse(message);
		if (type !== 'error') return; // Message is not for me

		console.error(`Error in room ${this.id} for player ${user_id}:`, payload);
		IOInterface.unsubscribe(`ws:all:broadcast:all`);
		//TODO : delete tournament
	}

	deconnexion(message: string) {
		const { type, user_id } = JSON.parse(message);
		if (type !== 'disconnected') return; // Message is not for me

		console.log(`Player ${user_id} disconnected from room ${this.id}`);
		IOInterface.unsubscribe(`ws:all:broadcast:all`);
		//TODO : delete tournament
	}

	toJSON() {
		return {
			// TODO : infos for front
		}
	}
}