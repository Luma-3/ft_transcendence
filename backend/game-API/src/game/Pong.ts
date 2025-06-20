import { GameObjectFactory } from "./engine/GameObjectFactory.js";
import { Vector2 } from "./Vector.js";
import { GameObject } from "./engine/GameObject.js";

import { Ball } from "./Ball.js";
import { LoopManager } from "./engine/gameLoop.js";
// import { Paddle } from "./Paddle.js";

export class Pong extends GameObject {
  public readonly scale: Vector2 = new Vector2(800, 600);

  private gameObjectsFactory: GameObjectFactory = null;

  private ball: Ball = null;

  constructor(ctx: LoopManager) {
    super();
    this.gameObjectsFactory = new GameObjectFactory(ctx);
  }

  onInstantiate(): void {
    console.log("Pong game object instantiated:");
    this.ball = this.gameObjectsFactory.create(Ball);
  }

  update() {

  }


  snapshot() {
    return {
      ball: this.ball.snapshot(),
    };
  }
}
