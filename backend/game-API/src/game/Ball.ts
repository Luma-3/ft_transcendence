import { Vector2 } from "../core/physics/Vector.js";
import { GameObject } from "../core/GameObject.js";
import { Circle } from "../core/physics/Shapes.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";

export class Ball extends GameObject implements Circle {
  private velocity: Vector2 = new Vector2(-1, 1);

  public position: Vector2 = new Vector2(0, 0);
  public readonly radius: number = 10;

  private readonly minSpeed: number = 100;
  private readonly maxSpeed: number = 500;

  onInstantiate(): void {
    this.startPosition(new Vector2(400, 300));
  }

  update() {
    this.move();
    this.checkTopBottomCollision();
  }

  collider(): Circle {
    return {
      position: this.position,
      radius: this.radius
    };
  }

  onCollision(other: GameObject): void {
    if (other instanceof Paddle) {
      this.rebound(other);
    }
  }


  checkTopBottomCollision() {
    if (this.position.y - this.radius < 0 || this.position.y + this.radius > 600) {
      this.velocity = this.velocity.mult(new Vector2(1, -1));
    }
  }

  move() {
    const direction = this.velocity.normalize();
    let speed = this.velocity.magnitude();

    speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, speed));  // Clamp speed
    this.position = this.position.add(direction.scale(speed * SceneContext.get().loopManager.deltaTime));
    this.velocity = direction.scale(speed);
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  rebound(paddle: Paddle) {
    const paddleVelocity = paddle.velocity;

    this.velocity = this.velocity.add(paddleVelocity.scale(0.2)); // Add some paddle velocity to the ball

    this.velocity = this.velocity.mult(new Vector2(-1, 1));
  }

  snapshot() {
    return {
      type: 'ball',
      id: 'ball',
      position: this.position,
      velocity: this.velocity,
      radius: this.radius
    };
  }
}
