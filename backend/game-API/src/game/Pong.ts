import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";

export const game = () => {
  console.log("Game started");

  GameObject.instantiate(Ball);
  GameObject.instantiate(Paddle, SceneContext.get().players[0].user_id, new Vector2(50, 250)); // Left paddle
  if (SceneContext.get().gameType === "local" || SceneContext.get().gameType === "ai") {
    GameObject.instantiate(Paddle, 'other', new Vector2(750, 250)); // Right paddle for local game
  }
  else {
    GameObject.instantiate(Paddle, SceneContext.get().players[1].user_id, new Vector2(750, 250)); // Right paddle for online game
  }
  SceneContext.get().inputManager.start(); // Start the input manager
  SceneContext.get().loopManager.start(); // Start the game loop
}
