import { GameObject } from "../core/GameObject.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { IOInterface } from "../utils/IOInterface.js";

interface PlayerInput {
  up: boolean;
  down: boolean;
}

export class InputManager extends GameObject {
  public playersInput: Map<string, PlayerInput> = new Map();

  public constructor() {
    super();
  }

  public static getInstance(): InputManager {
    const ctx = SceneContext.get();
    if (!ctx.inputManager) {
      ctx.inputManager = GameObject.instantiate(InputManager);
    }
    return ctx.inputManager;
  }

  public onInstantiate(): void {
    const players = SceneContext.get().players;
    if (SceneContext.get().gameType === "local") {
      this.playersInput.set(players[0].user_id, { up: false, down: false });
      this.playersInput.set("other", { up: false, down: false });
      this.subscribePlayerInput([players[0].user_id]);
      return;
    }
    players.forEach(player => {
      this.playersInput.set(player.user_id, { up: false, down: false });
    })
    this.subscribePlayerInput(players.map(player => player.user_id));
  }

  public update(): void {

  }

  private subscribePlayerInput(playerIds: string[]): void {
    playerIds.forEach(playerId => {
      IOInterface.subscribe(`ws:game:player:${playerId}`, this.handleInput);
    });
  }


  public handleInput(message: string, channel: string): void {
    const payload = JSON.parse(message);
    const [, playerId] = channel.split(':').slice(-2);
    if (playerId !== payload.user_id) {
      console.warn(`InputManager: Player ID mismatch. Expected ${playerId}, got ${payload.user_id}`);
      return;
    }
    if (payload.move !== 'input') return;
    let playerInput = this.playersInput.get(playerId);
    playerInput = {
      up: payload.data.movement.up,
      down: payload.data.movement.down
    }
    if (SceneContext.get().gameType === "local") {
      playerInput = this.playersInput.get("other")!;
      playerInput = {
        up: payload.data.otherMovement?.up || false,
        down: payload.data.otherMovement?.down || false
      }
    }
  }
}
