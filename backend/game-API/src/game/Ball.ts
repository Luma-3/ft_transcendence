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
      this.rebound(other.velocity);
    }
  }


  checkTopBottomCollision() {

    if (this.position.y - this.radius < 0 || this.position.y + this.radius > 600) {
      this.velocity = this.velocity.mult(new Vector2(1, -1));
    }
  }

  move() {
    const direction = this.velocity.normalize();
    const currentSpeed = this.velocity.magnitude();

    const clampedSpeed = Math.max(this.minSpeed, Math.min(currentSpeed, this.maxSpeed)); // Clamped speed

    this.position = this.position.add(direction.scale(clampedSpeed * SceneContext.get().loopManager.deltaTime));
    this.velocity = direction.scale(clampedSpeed);
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  ClampVelocity() {
    const maxSpeed = 300; // Maximum speed of the ball
    if (this.velocity.magnitude() > maxSpeed) {
      this.velocity = this.velocity.normalize().scale(maxSpeed);
    }
  }

  rebound(paddle_vec: Vector2) {
    // this.velocity = this.velocity.add(paddle_vec.scale(0.5));
    this.velocity = this.velocity.multiply(new Vector2(-1, 1));

    // Ensure the ball has no stick to the paddle
    const paddleDirection = paddle_vec.normalize();
    const paddleSpeed = paddle_vec.magnitude();

    const dir = this.velocity.normalize().add(paddleDirection).normalize();
    this.position = this.position.add(this.velocity.normalize().scale(this.radius * 0.2)); // Move the ball away from the paddle to prevent sticking
    this.velocity = dir.scale(Math.max(this.minSpeed, Math.min(paddleSpeed, this.maxSpeed)));

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
