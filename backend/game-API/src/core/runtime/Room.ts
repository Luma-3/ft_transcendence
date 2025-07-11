import { v4 as uuidv4 } from 'uuid';
import { GameType } from '../../room/room.schema.js';
import { LoopManager } from '../loop/LoopManager.js';
import { IOInterface } from '../../utils/IOInterface.js';
import { SceneContext } from './SceneContext.js';
import { Player, IGameInfos } from './Player.js';
import { game } from '../../game/Pong.js';
import { InputManager } from '../../game/InputManager.js';
import { randomNameGenerator } from './randomName.js';
import { roomManagerInstance } from './RoomManager.js';

type StatusType = 'waiting' | 'roomReady' | 'playing' | 'finished';

const MAX_PLAYER: number = 2;

export class Room {
  public readonly id: string;
  private readonly name: string;
  private readonly gameType: GameType;

  public players: Map<string, Player> = new Map();
  private status: StatusType = 'waiting';

  public loopManager: LoopManager = new LoopManager();
  public inputManager: InputManager = new InputManager();

  // private readonly createdAt: Date = new Date();

  private privateRoom: boolean = false;

  constructor(gameInfos: IGameInfos) {
    this.id = uuidv4();
    this.name = gameInfos.name;
    console.log(`Creating room with id: ${this.id}`);
    this.gameType = gameInfos.type_game;
    this.privateRoom = gameInfos.privateRoom;

    if (this.gameType === 'ai') {
      // Create a room with AI player
      const name = randomNameGenerator();
      this.players.set('ai', new Player('ai', name));
      const player = this.players.get('ai');
      player!.avatar = `https://${process.env.AUTHORIZED_IP}/api/uploads/avatar/default.png`;
      player!.ready = true;
      this.privateRoom = true;
    }
    else if (this.gameType === 'local') {
      // TODO : gerer le nom du joueur local
      this.players.set('local', new Player('local', gameInfos.localPlayerName));
      const player = this.players.get('local');
      player!.avatar = `https://${process.env.AUTHORIZED_IP}/api/uploads/avatar/default.png`;
      player!.ready = true;
      this.privateRoom = true;
    }

    IOInterface.subscribe(`ws:all:broadcast:all`, this.error.bind(this));
    IOInterface.subscribe(`ws:all:broadcast:all`, this.deconnexion.bind(this));
  }

  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER && this.privateRoom === false); }
  nbPlayers() { return this.players.size; }

  async addPlayer(player: Player) {
    this.players.set(player.id, player);
    player.side = (this.players.size === 1) ? 'left' : 'right';

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

    console.log(`Player ${user_id} is ready in room ${this.id}`);
    IOInterface.broadcast(
      JSON.stringify({ action: 'playerReady', data: this.toJSON() }),
      [...this.players.keys()]
    );

    this.tryStart();
  }

  tryStart() {
    for (const player of this.players.values()) {
      if (!player.ready) return;
    }

    IOInterface.unsubscribe(`ws:game:room:${this.id}`);
    this.start();
  }

  error(message: string) {
    const { type, user_id, payload } = JSON.parse(message);
    if (type !== 'error') return; // Message is not for me

    console.error(`Error in room ${this.id} for player ${user_id}:`, payload);
    IOInterface.unsubscribe(`ws:all:broadcast:all`);
    IOInterface.unsubscribe(`ws:game:room:${this.id}`);
    IOInterface.broadcast(
      JSON.stringify({ action: 'error', data: { message: `An error occurred with player: ${user_id} details: ${payload}` } }),
      [...this.players.keys()]
    );
    this.players.clear();
    roomManagerInstance.deleteRoom(this.id);
  }

  deconnexion(message: string) {
    const { type, user_id } = JSON.parse(message);
    if (type !== 'disconnected') return; // Message is not for me

    console.log(`Player ${user_id} disconnected from room ${this.id}`);
    IOInterface.unsubscribe(`ws:all:broadcast:all`);
    IOInterface.unsubscribe(`ws:game:room:${this.id}`);
    IOInterface.broadcast(
      JSON.stringify({ action: 'disconnected', data: { message: `${user_id} has disconnected.` } }),
      [...this.players.keys()]
    );
    this.players.clear();
    roomManagerInstance.deleteRoom(this.id);
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
      name: this.name,
      gameType: this.gameType,
      players: Array.from(this.players.values()).map(player => player.toJSON()),
      status: this.status,
    };
  }
}


