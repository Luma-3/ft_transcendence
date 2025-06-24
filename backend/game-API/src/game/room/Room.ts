import { v4 as uuidv4 } from 'uuid';
import { gameType } from '../../room/room.schema.js';
import { LoopManager } from '../engine/LoopManager.js';
import { IOInterface } from '../../utils/IOInterface.js';
import { SceneContext } from './SceneContext.js';
import { Player, IGameInfos } from './Interface.js';

type StatusType = 'waiting' | 'roomReady' | 'playersReady' | 'playing' | 'finished';

const MAX_PLAYER: number = 2;

export class Room {
  public readonly id: string;
  // private readonly name: string;
  private readonly gameType: gameType;

  public players: Player[] = [];
  private status: StatusType = 'waiting';

  public loopManager: LoopManager = new LoopManager();
  // public ioManager: IOManager = new IOManager();

  public context: SceneContext = new SceneContext(this.loopManager, this.ioManager);

  // private readonly createdAt: Date = new Date();
  // private playerReady: number = 0;

  // private roomPrivate: boolean = false; // Peut-etre ?

  constructor(gameInfos: IGameInfos) {
    this.id = uuidv4();
    // this.name = gameInfos.name;

    this.gameType = gameInfos.type_game;
    if (this.gameType == 'localpvp' || this.gameType == 'localpve') {
      this.status = 'roomReady';
    }
  }

  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER); }
  nbPlayers() { return this.players.length; }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  start() {
    console.log("Starting game for room:", this.id);
    this.status = 'playing';

    const payload = {
      action: 'startGame',
      data: {
        roomId: this.id,
        gameType: this.gameType,
        players: this.players.map(payer => payer.toJSON())
      }
    };
    IOInterface.broadcast(JSON.stringify(payload), this.players.map(player => player.user_id));

    SceneContext.use(this.context, game);
    this.loopManager.start();
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

const game = () => {
  // Here we can instantiate game objects, e.g.:
  // GameObject.instantiate();
}

