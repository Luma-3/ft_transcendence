import { Vector2 } from "../core/physics/Vector.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { IOInterface } from "../utils/IOInterface.js";

export class InputManager {
  public playersInput: Map<string, Vector2> = new Map();

  public start() {
    const players = SceneContext.get().players;
    console.log("InputManager: onInstantiate", players);
    if (SceneContext.get().gameType === "local") {

      this.playersInput.set(players[1].id, Vector2.zero());
      this.playersInput.set("other", Vector2.zero());
      IOInterface.subscribe(`ws:game:player:${players[1].id}`, handleInput.bind(SceneContext.get()));
      return;
    }
    players.forEach(player => {
      this.playersInput.set(player.id, Vector2.zero());
      IOInterface.subscribe(`ws:game:player:${player.id}`, handleInput.bind(SceneContext.get()));
    })
  }

  get(playerId: string): Vector2 {
    return this.playersInput.get(playerId);
  }

  set(playerId: string, input: Vector2) {
    this.playersInput.set(playerId, input);
  }
}

function handleInput(message: string, channel: string): void {
  const payload = JSON.parse(message);
  const [, playerId] = channel.split(':').slice(-2);

  if (playerId !== payload.user_id) {
    console.warn(`InputManager: Player ID mismatch. Expected ${playerId}, got ${payload.user_id}`);
    return; // TODO : stop game
  }
  if (payload.action !== 'input') return;

  let movement = payload.data.movement;
  const inputManager = (this as SceneContext).inputManager;

  inputManager.get(playerId).y = +movement.up - +movement.down;

  if (this.gameType === "local") {
    movement = payload.data.otherMovement;
    inputManager.get("other").y = +movement.up - +movement.down;
  }
}
