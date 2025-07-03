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

    if (this.gameType === 'ai') {
      // Create a room with AI player
      // TODO : handle random AI player name : utils folder
      this.players.push(new Player('ai', 'AI Player'));
      this.players[0].ready = true;
    }
    else if (this.gameType === 'local') {
      // TODO : gerer le nom du joueur local
      this.players.push(new Player('other', 'Other Player'));
      // TODO : modif this for ready of local palyer
      this.players[0].ready = true;
    }
  }

  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER); }
  nbPlayers() { return this.players.length; }

  addPlayer(player: Player) {
    this.players.push(player);

    IOInterface.send(
      JSON.stringify({ action: 'joined', data: this.toJSON() }),
      player.user_id
    ); // Notify the player who joined

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerJoined', data: this.toJSON() }),
      this.players.map(p => p.user_id)
    ); // Notify all players in the room

    this.tryRoomReady();
  }

  private tryRoomReady() {
    if (this.nbPlayers() !== MAX_PLAYER) return;

    this.status = 'roomReady';

    IOInterface.subscribe(`ws:game:room:${this.id}`, this.callbackPlayerReady);
    IOInterface.broadcast(
      JSON.stringify({ action: 'roomReady', data: this.toJSON() }),
      this.players.map(p => p.user_id)
    );
  }

  callbackPlayerReady = (message: string) => {
    const { user_id, action } = JSON.parse(message);
    const player = this.players.find(p => p.user_id === user_id);

    if (action !== 'ready' || !player) return;
    player.ready = true;

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerReady', data: this.toJSON() }),
      this.players.map(p => p.user_id)
    );

    this.tryStart();
  }

  tryStart() {
    if (this.players.every(player => player.ready)) {
      IOInterface.unsubscribe(`ws:game:room:${this.id}`);
      this.start();
    }
  }

  start() {
    this.status = 'playing';

    IOInterface.broadcast(
      JSON.stringify({ action: 'starting', data: this.toJSON() }),
      this.players.map(player => player.user_id)
    );

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
      players: this.players.map(player => player.toJSON()),
      status: this.status,
    };
  }
}


