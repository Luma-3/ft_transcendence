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
  GameObject.instantiate(Paddle, '1', new Vector2(50, 250)); // Left paddle
  GameObject.instantiate(Paddle, '2', new Vector2(750, 250)); // Right paddle
  SceneContext.get().loopManager.start(); // Start the game loop
}
