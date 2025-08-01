import { v4 as uuidv4 } from 'uuid';
import { GameType } from '../../room/room.schema.js';
import { LoopManager } from '../loop/LoopManager.js';
import { IOInterface } from '../../utils/IOInterface.js';
import { SceneContext } from './SceneContext.js';
import { Player, IGameInfos } from './Player.js';
import { game } from '../../game/Pong.js';
import { InputManager } from '../../game/InputManager.js';
import { randomNameGenerator } from './randomName.js';
import { RoomManager } from './RoomManager.js';
import { RoomModelInstance } from '../../room/model.js';
import { RoomService } from '../../room/room.service.js';

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

  private readonly createdAt: Date = new Date();

  private privateRoom: boolean = false;

  constructor(gameInfos: IGameInfos) {
    this.id = uuidv4();
    this.name = gameInfos.name;
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
      this.players.set('local', new Player('local', gameInfos.localPlayerName));
      const player = this.players.get('local');
      player!.avatar = `https://${process.env.AUTHORIZED_IP}/api/uploads/avatar/default.png`;
      player!.ready = true;
      this.privateRoom = true;
    }
  }

  getStatus(): string { return this.status };

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

  start() {
    this.status = 'playing';

    IOInterface.broadcast(
      JSON.stringify({ action: 'starting', data: this.toJSON() }),
      [...this.players.keys()]
    );

    const ctx = new SceneContext(this.id, this.gameType, this.players, this.loopManager, this.inputManager);
    SceneContext.run(ctx, game);
  }

  error(user_id: string, payload: any) {
    if (this.players.get(user_id) === undefined) return; // Message is not for me

    IOInterface.broadcast(
      JSON.stringify({ action: 'error', data: { message: `An error occurred with player: ${user_id} details: ${payload}` } }),
      [...this.players.keys()]
    );
    RoomManager.getInstance().emit('room:error', this.id);
  }

  disconnected(user_id: string) {
    if (this.players.get(user_id) === undefined) return; // Message is not for me

    IOInterface.broadcast(
      JSON.stringify({ action: 'disconnected', data: { message: `${user_id} has disconnected.` } }),
      [...this.players.keys()]
    );
    RoomManager.getInstance().emit('room:playerleft', this.id);
  }

  public stop(addData: boolean = true) {
    this.loopManager.stop();
    this.inputManager.stop();
    IOInterface.unsubscribe(`ws:game:room:${this.id}`);

    if (addData) {
      const scene = SceneContext.get();
      const players = Array.from(this.players.values());
      const payload = {
        id: this.id,
        created_at: this.createdAt,
        player_1: (players[0].id === "local") ? null : players[0].id,
        player_2: players[1].id,
        winner: (players[0].win) ? players[0].id : players[1].id,
        score_1: players[0].score,
        score_2: players[1].score,
        type: scene.gameType,
      }
      RoomModelInstance.addMatch(payload)
      RoomService.addRank(players[0].id, players[0].win ? 'win' : 'loss');
      RoomService.addRank(players[1].id, players[1].win ? 'win' : 'loss');
      this.players.clear();
    }
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
