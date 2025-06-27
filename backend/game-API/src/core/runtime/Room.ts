import { v4 as uuidv4 } from 'uuid';
import { gameType } from '../../room/room.schema.js';
import { LoopManager } from '../loop/LoopManager.js';
import { IOInterface } from '../../utils/IOInterface.js';
import { SceneContext } from './SceneContext.js';
import { Player, IGameInfos } from './Interface.js';
import { game } from '../../game/Pong.js';
import { InputManager } from '../../game/InputManager.js';

type StatusType = 'waiting' | 'roomReady' | 'playing' | 'finished';

const MAX_PLAYER: number = 2;

export class Room {
  public readonly id: string;
  // private readonly name: string;
  private readonly gameType: gameType;

  public players: Player[] = [];
  private status: StatusType = 'waiting';

  public loopManager: LoopManager = new LoopManager();
  public inputManager: InputManager = new InputManager();
  // public ioManager: IOManager = new IOManager();

  // private readonly createdAt: Date = new Date();
  // private playerReady: number = 0;

  // private roomPrivate: boolean = false; // Peut-etre ?

  constructor(gameInfos: IGameInfos) {
    this.id = uuidv4();
    // this.name = gameInfos.name;
    console.log(`Creating room with id: ${this.id}`);
    this.gameType = gameInfos.type_game;
  }

  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER); }
  nbPlayers() { return this.players.length; }

  addPlayer(player: Player) {
    this.players.push(player);
    const data = {
      roomId: this.id,
      player: player.toJSON(),
      players: this.players.map(p => p.toJSON()),
      status: this.status
    }
    const payloadPlayer = {
      action: 'joined',
      data: data
    };
    const payloadBroadcast = {
      action: 'playerJoined',
      data: data
    };
    IOInterface.send(JSON.stringify(payloadPlayer), player.user_id); // Notify the player who joined
    IOInterface.broadcast(JSON.stringify(payloadBroadcast), this.players.map(p => p.user_id)); // Notify all players in the room
    this.tryRoomReady();
  }

  tryRoomReady() {
    const data = {
      roomId: this.id,
      players: this.players.map(p => p.toJSON()),
      status: this.status
    }
    console.log("Game type:", this.gameType);
    // Local or AI game with only one player
    if ((this.gameType === 'local' || this.gameType === 'ai') && this.nbPlayers() === 1) {
      console.log("Room is ready for local or AI game with one player");
      this.status = 'roomReady';
      IOInterface.subscribe(`ws:game:room:${this.id}`, this.callbackPlayerReady);
      IOInterface.send(JSON.stringify({ action: 'roomReady', data: data }), this.players[0].user_id);
    }
    else if (this.gameType === 'online' && this.nbPlayers() === MAX_PLAYER) { // Online game with two players
      this.status = 'roomReady';
      IOInterface.subscribe(`ws:game:room:${this.id}`, this.callbackPlayerReady);
      IOInterface.broadcast(JSON.stringify({ action: 'roomReady', data: data }), this.players.map(p => p.user_id));
    }
    // TODO : Add Tournament
  }

  callbackPlayerReady = (message: string) => {
    console.log("callbackPlayerReady", message);
    const { user_id, action } = JSON.parse(message);

    if (action !== 'ready') return;
    const player = this.players.find(p => p.user_id === user_id);

    if (!player) return;
    player.ready = true;

    console.log(`Player ${user_id} is ready in room ${this.id}`);
    const data = {
      roomId: this.id,
      player: player.toJSON(),
      players: this.players.map(p => p.toJSON()),
      status: this.status
    }
    IOInterface.broadcast(JSON.stringify({ action: 'playerReady', data: data }), this.players.map(p => p.user_id));
    this.tryStart();
  }

  tryStart() {
    if (this.players.every(player => player.ready)) {
      IOInterface.unsubscribe(`ws:game:room:${this.id}`);
      this.start();
    }
  }

  start() {
    console.log("Starting game for room:", this.id);
    this.status = 'playing';

    const payload = {
      action: 'Starting',
      data: {
        roomId: this.id,
        gameType: this.gameType,
        players: this.players.map(payer => payer.toJSON())
      }
    };
    IOInterface.broadcast(JSON.stringify(payload), this.players.map(player => player.user_id));
    const ctx = new SceneContext(this.id, this.gameType, this.players, this.loopManager, this.inputManager);
    SceneContext.run(ctx, game);
  }

  changeStatus(status: StatusType) {
    this.status = status;
  }

  toJSON() {
    return {
      id: this.id,
      game_type: this.gameType,
      players: this.players,
      status: this.status,
    };
  }
}


