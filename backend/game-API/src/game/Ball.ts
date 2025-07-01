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
      // Ensure the ball is not stuck in the wall
      this.position.y = Math.max(this.radius, Math.min(this.position.y, 600 - this.radius));
    }
  }

  checkGoal() {
    if (this.position.x < 0) return 'left';
    if (this.position.x > 800) return 'right';
    return null;
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


  rebound(paddle_vec: Vector2) {
    this.velocity = this.velocity.multiply(new Vector2(-1, 1));

    // Ensure the ball has no stick to the paddle
    const paddleDirection = paddle_vec.normalize();
    const paddleSpeed = paddle_vec.magnitude();


    const dir = this.velocity.normalize().add(paddleDirection).normalize();
    const currentSpeed = this.velocity.magnitude();

    const newSpeed = Math.max(this.minSpeed, Math.min(currentSpeed + (paddleSpeed * 0.2), this.maxSpeed));

    const newVelocity = dir.scale(newSpeed);

    const minX = 0.5
    let postDirection = newVelocity.normalize();
    const postSpeed = newVelocity.magnitude();
    if (Math.abs(postDirection.x) < minX) {
      const sign = Math.sign(postDirection.x) || 1; // Ensure we have a sign to avoid zero division
      postDirection.x = sign * minX;

      const remaining = Math.sqrt(1 - minX * minX);
      postDirection.y = postDirection.y >= 0 ? remaining : -remaining;
    }
    this.velocity = postDirection.scale(postSpeed);

    this.position = this.position.add(this.velocity.normalize().scale(this.radius * 0.2)); // Move the ball away from the paddle to prevent sticking
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
