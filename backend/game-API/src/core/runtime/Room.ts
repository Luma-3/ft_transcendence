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

  public players: Map<string, Player> = new Map();
  // public players: Player[] = [];
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
      this.players.set('ai', new Player('ai', 'AI Player'));
      this.players.get('ai').ready = true; // AI is always ready
    }
    else if (this.gameType === 'local') {
      // TODO : gerer le nom du joueur local
      this.players.set('local', new Player('local', 'Local Player'));
      // TODO : modif this for ready of local palyer
      this.players.get('local').ready = true; // Local player is always ready
    }
  }

  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER); }
  nbPlayers() { return this.players.size; }

  async addPlayer(player: Player) {
    this.players.set(player.id, player);

    const response = await fetch(`http://${process.env.USER_IP}/users/${player.id}?includePreferences=true`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.error(`Failed to fetch player info for ${player.id}`);
      return;
    }

    const playerInfo = await response.json();

    player.avatar = playerInfo.data.preferences.avatar;
    player.player_name = playerInfo.data.username;

    IOInterface.send(
      JSON.stringify({ action: 'joined', data: this.toJSON() }),
      player.id
    ); // Notify the player who joined

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerJoined', data: this.toJSON() }),
      [...this.players.keys()]
    ); // Notify all players in the room

    this.tryRoomReady();
  }

  private tryRoomReady() {
    if (this.nbPlayers() !== MAX_PLAYER) return;

    this.status = 'roomReady';

    IOInterface.subscribe(`ws:game:room:${this.id}`, this.callbackPlayerReady);
    IOInterface.broadcast(
      JSON.stringify({ action: 'roomReady', data: this.toJSON() }),
      [...this.players.keys()]
    );
  }

  callbackPlayerReady = (message: string) => {
    const { user_id, action } = JSON.parse(message);
    const player = this.players.get(user_id);

    if (action !== 'ready' || !player) return;
    player.ready = true;

    IOInterface.broadcast(
      JSON.stringify({ action: 'playerReady', data: this.toJSON() }),
      [...this.players.keys()]
    );

    this.tryStart();
  }

  tryStart() {
    for (const player of this.players.values()) {
      if (!player.ready) {
        return;
      }
    }

    IOInterface.unsubscribe(`ws:game:room:${this.id}`);
    this.start();

  }

  start() {
    this.status = 'playing';

    IOInterface.broadcast(
      JSON.stringify({ action: 'starting', data: this.toJSON() }),
      [...this.players.keys()]
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
      players: Array.from(this.players.values()).map(player => player.toJSON()),
      status: this.status,
    };
  }
}


