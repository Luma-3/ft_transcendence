import { Vector2 } from "../core/physics/Vector.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { IOInterface } from "../utils/IOInterface.js";

export class InputManager {
  public playersInput: Map<string, Vector2> = new Map();

  public start() {
    const playersId = [...SceneContext.get().players.keys()];
    if (SceneContext.get().gameType === "local") {
      this.playersInput.set(playersId[1], Vector2.zero());
      this.playersInput.set("local", Vector2.zero());
      IOInterface.subscribe(`ws:game:player:${playersId[1]}`, handleInput.bind(SceneContext.get()));
      return;
    }
    playersId.forEach(player => {
      this.playersInput.set(player, Vector2.zero());
      IOInterface.subscribe(`ws:game:player:${player}`, handleInput.bind(SceneContext.get()));
    })
  }

  public stop() {
    const playersId = [...this.playersInput.keys()];
    this.playersInput.clear();
    playersId.forEach(player => {
      IOInterface.unsubscribe(`ws:game:player:${player}`);
    });
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

  if (playerId !== payload.user_id) return; // UID mismatch, ignore the message
  if (payload.action !== 'input') return;

  let movement = payload.data.movement;
  const inputManager = (this as SceneContext).inputManager;

  inputManager.get(playerId).y = +movement.up - +movement.down;

  if (this.gameType === "local" && payload.data.otherMovement) {
    movement = payload.data.otherMovement;
    inputManager.get("local").y = +movement.up - +movement.down;
  }
}
