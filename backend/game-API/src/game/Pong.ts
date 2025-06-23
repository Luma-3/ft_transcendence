import { GameObjectFactory } from "./engine/GameObjectFactory.js";
import { Vector2 } from "./engine/Vector.js";
import { GameObject } from "./engine/GameObject.js";

import { Ball } from "./Ball.js";
import { LoopManager } from "./engine/LoopManager.js";
import { Paddle } from "./Paddle.js";


// TODO : Demain Mettre en place le system de Scene pour le Pong avec Multi SceneContext Async Singleton
export class Pong extends GameObject {
  public readonly scale: Vector2 = new Vector2(800, 600);

  private gameObjectsFactory: GameObjectFactory = null;

  // Isn't possible to preinstantiate GameObjects in one GameObject beause GameObjectFactory is not available at that time
  private pabbleLeft: Paddle = null;
  private pabbleRight: Paddle = null; // TODO: Create Paddle for right side
  private ball: Ball = null;

  constructor(ctx: LoopManager) {
    super();
    this.gameObjectsFactory = new GameObjectFactory(ctx);
  }

  onInstantiate(): void {
    console.log("Pong game object instantiated:");
    this.ball = this.gameObjectsFactory.create(Ball);
    this.ball = this.ball; // for TypeScript it's used

    this.pabbleLeft = this.gameObjectsFactory.create(Paddle, '1', new Vector2(50, 250));
    this.pabbleLeft = this.pabbleLeft; // for TypeScript it's used

    this.pabbleRight = this.gameObjectsFactory.create(Paddle, '2', new Vector2(730, 250));
    this.pabbleRight = this.pabbleRight; // for TypeScript it's used
  }

  update() {

  }

  collider() {
    return undefined; // Pong does not have a collider
  }

  onCollision(other: GameObject): void {
    other = other; // Placeholder for collision handling
  }

  snapshot() {
    return {
      id: 'scene',
      scale: this.scale,
    };
  }
}
