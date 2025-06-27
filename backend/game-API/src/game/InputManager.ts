import { SceneContext } from "../core/runtime/SceneContext.js";
import { IOInterface } from "../utils/IOInterface.js";

interface PlayerInput {
  up: boolean;
  down: boolean;
}

export class InputManager {
  public playersInput: Map<string, PlayerInput> = new Map();

  public constructor() {

  }

  public start() {
    const players = SceneContext.get().players;
    console.log("InputManager: onInstantiate", players);
    if (SceneContext.get().gameType === "local") {
      this.playersInput.set(players[0].user_id, { up: false, down: false });
      this.playersInput.set("other", { up: false, down: false });
      IOInterface.subscribe(`ws:game:player:${players[0].user_id}`, this.handleInput.bind(SceneContext.get().inputManager));
      return;
    }
    players.forEach(player => {
      this.playersInput.set(player.user_id, { up: false, down: false });
      IOInterface.subscribe(`ws:game:player:${player.user_id}`, this.handleInput.bind(SceneContext.get().inputManager));
    })
  }


  get(playerId: string): PlayerInput {
    return this.playersInput.get(playerId);
  }

  public handleInput(message: string, channel: string): void {
    const payload = JSON.parse(message);
    const [, playerId] = channel.split(':').slice(-2);
    if (playerId !== payload.user_id) {
      console.warn(`InputManager: Player ID mismatch. Expected ${playerId}, got ${payload.user_id}`);
      return; // TODO : stop game
    }


    if (payload.action !== 'input') return;

    console.log("InputManager: handleInput", payload, playerId);

    const inputManager = this.playersInput;
    inputManager.get(playerId).up = payload.data.movement.up;
    inputManager.get(playerId).down = payload.data.movement.down;

    // if (SceneContext.get().gameType === "local") {
    //   inputManager.get("other").up = payload.data.otherMovement.up;
    //   inputManager.get("other").down = payload.data.otherMovement.down;
    // }
  }
}
