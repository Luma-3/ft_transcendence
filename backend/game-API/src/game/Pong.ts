import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";

export const game = () => {
  // Here we can instantiate game objects, e.g.:
  // GameObject.instantiate();
  console.log("Game started");


  GameObject.instantiate(Ball);
  GameObject.instantiate(Paddle, '1', new Vector2(50, 250), SceneContext.get().players[0].user_id); // Left paddle
  GameObject.instantiate(Paddle, '2', new Vector2(750, 250), "other"); // Right paddle
  SceneContext.get().inputManager.start(); // Start the input manager
  SceneContext.get().loopManager.start(); // Start the game loop
}
