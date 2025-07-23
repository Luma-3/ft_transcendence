import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from '@transcenduck/error'

import { Player } from "../core/runtime/Player.js";
import { IOInterface } from '../utils/IOInterface.js';
import { RoomManager } from '../core/runtime/RoomManager.js';

import { TournamentManager } from './TournamentManager.js';

type StatusType = 'waiting' | 'readyToStart' | 'playing' | 'finished';

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
  public readonly id: string;

  private players: Player[] = [];
  private playerTournament: Player[] = [];
  private activeMatches: Map<string, Player[]> = new Map();
  private winners: Player[] = [];

  private pairs: [Player, Player][] = [];

  private matchHistory: [Player, Player][] = [];

  private status: StatusType = 'waiting';

  constructor() {
    this.id = uuidv4();

    IOInterface.subscribe(`ws:all:broadcast:all`, this.error.bind(this));
    IOInterface.subscribe(`ws:all:broadcast:all`, this.deconnexion.bind(this));
  }

  getStatus(): string { return this.status };

  isFinish(): boolean { return this.status === 'finished'; }
  isJoinable(): boolean { return this.status === 'waiting' && this.players.length < 4 }

  nbPlayers(): number { return this.players.length; }

  async addPlayer(player: Player) {
    if (this.players.find(aPlayer => aPlayer.id === player.id) !== undefined) {
      return;
    }
    this.players.push(player);
    this.playerTournament.push(player);

    IOInterface.send(
      JSON.stringify({ action: 'joined', data: this.toJSON() }),
      player.id
    ); // Notify the player who joined

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerJoined', data: this.toJSON() }),
      this.players.map((value) => value.id)
    ); // Notify all players in the room

    if (this.players.length === 4) {
      this.start();
    }
  }

  start() {
    this.status = 'playing';
    this.playerTournament = this.players;
    this.NextPool(this.playerTournament);
  }

  stop() {
    this.status = 'finished';

    [...this.activeMatches.keys()].forEach(roomId => {
      RoomManager.getInstance().stopRoom(roomId, false);
    })

    this.players = [];
    this.playerTournament = [];
    this.activeMatches.clear();
    this.winners = [];
    this.pairs = [];
    this.matchHistory = [];
  }

  NextPool(players: Player[]) {
    IOInterface.subscribe(`ws:all:broadcast:all`, this.error.bind(this));
    IOInterface.subscribe(`ws:all:broadcast:all`, this.deconnexion.bind(this));

    if (this.status === 'finished') {
      return;
    }
    this.pairs = this.createPairs(players);

    IOInterface.broadcast(
      JSON.stringify({ action: 'nextPool', data: this.toJSON() }),
      players.map((value) => value.id)
    );

    players.forEach(player => {
      player.reset();
    })

    setTimeout(() => {
      this.pairs.forEach(async ([p1, p2]) => {
        const roomId = RoomManager.getInstance().createRoom('mma in the pound', 'tournament', true);
        try {
          await Promise.all([
            RoomManager.getInstance().joinRoom(p1, roomId),
            RoomManager.getInstance().joinRoom(p2, roomId)
          ]);
          this.activeMatches.set(roomId, [p1, p2]);
        } catch (error) {
          if (error instanceof Error) {
            this.error('Tournament Failed');
          }
          RoomManager.getInstance().stopRoom(roomId, false);
        }
      });

      this.pairs = [];

      RoomManager.getInstance().on('room:end', (roomId, winner) => {
        this.endRoom(roomId, winner);
      })
    }, 10000); // waiting 10 seconds to let the player to see his pool

  }

  endRoom(roomId: string, winner: Player) {
    this.activeMatches.delete(roomId);
    this.winners.push(winner);

    if (this.activeMatches.size === 0) {
      if (this.winners.length === 1) {
        //TODO : call winner
        TournamentManager.getInstance().deleteTournament(this.id);
        return;
      }

      this.playerTournament = [...this.winners];
      this.winners = [];

      IOInterface.unsubscribe(`ws:all:broadcast:all`);
      this.NextPool(this.playerTournament);
    }
  }

  removePlayer(player: Player) {
    if (this.activeMatches.get(player.id) !== undefined || this.status !== 'waiting') {
      throw new ConflictError('User Already playing');
    }

    this.players = this.players.filter(aPlayer => aPlayer.id !== player.id);
    if (this.players.length === 0) {
      this.stop();
      return;
    }
    this.playerTournament = [...this.players];
  }

  createPairs(players: Player[]): [Player, Player][] {
    const shuffled = shuffle(players);
    const pairs: [Player, Player][] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        pairs.push([shuffled[i], shuffled[i + 1]]);
        this.matchHistory.push([shuffled[i], shuffled[i + 1]]);
      }
      else {
        this.winners.push(shuffled[i]);
      }
    }

    return pairs;
  }

  error(message: string) {
    const { type, user_id, payload } = JSON.parse(message);
    if (this.playerTournament.find(player => player.id === user_id) === undefined) return; // Message is not for me
    if (type !== 'error') return; // Message is not for me

    IOInterface.broadcast(
      JSON.stringify({ action: 'error', data: { message: `An error occurred with player: ${user_id} details: ${payload}` } }),
      this.playerTournament.map((value) => value.id)
    );
    IOInterface.unsubscribe(`ws:all:broadcast:all`);
    TournamentManager.getInstance().deleteTournament(this.id);
  }

  deconnexion(message: string) {
    const { type, user_id } = JSON.parse(message);
    if (this.playerTournament.find(player => player.id === user_id) === undefined) return; // Message is not for me
    if (type !== 'disconnected') return; // Message is not for me

    IOInterface.broadcast(
      JSON.stringify({ action: 'disconnected', data: { message: `${user_id} has disconnected.` } }),
      this.playerTournament.map((value) => value.id)
    );
    IOInterface.unsubscribe(`ws:all:broadcast:all`);
    TournamentManager.getInstance().deleteTournament(this.id);
  }

  toJSON() {
    return {
      rooms: this.matchHistory.map(([p1, p2]) => [p1.toJSON(), p2.toJSON()])
    }
  }
}
