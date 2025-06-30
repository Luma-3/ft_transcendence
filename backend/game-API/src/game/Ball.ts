import { Vector2 } from "../core/physics/Vector.js";
import { GameObject } from "../core/GameObject.js";
import { Circle } from "../core/physics/Shapes.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { EdgeCollider } from "./EdgeCollider.js";

export class Ball extends GameObject implements Circle {
  private velocity: Vector2 = new Vector2(-1, 1);

  public position: Vector2 = new Vector2(0, 0);
  public readonly radius: number = 10;

  private readonly minSpeed: number = 100;
  private readonly maxSpeed: number = 300;

  // -- REQUIREMENTS FUNCTION --

  onInstantiate(): void {
    this.startPosition(new Vector2(400, 300));
  }

  update() {
    this.move();
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
    else if (other instanceof EdgeCollider) {
      this.velocity = this.velocity.multiply(new Vector2(1, -1));
    }
  }

  // -- END REQUIREMENTS FUNCTION --

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
    // Clamp the velocity to ensure it doesn't exceed a certain speed
    const maxSpeed = 300; // Maximum speed of the ball
    if (this.velocity.magnitude() > maxSpeed) {
      this.velocity = this.velocity.normalize().scale(maxSpeed);
    }
  }

  rebound(paddle_vec: Vector2) {
    // add the paddle verctor to the ball for a more realistic bounce
    this.velocity = this.velocity.add(paddle_vec.scale(0.5)); // Adjust the rebound effect based on paddle velocity
    this.velocity = this.velocity.multiply(new Vector2(-1, 1)); // Reverse the x direction and keep the y direction

    // Ensure the ball has no stick to the paddle
    this.position = this.position.add(this.velocity.normalize().scale(this.radius * 0.2)); // Move the ball away from the paddle to prevent sticking

    // Ensure the ball has a minimum speed in the x direction
    const minX = 0.3;
    if (Math.abs(this.velocity.x) < minX) {
      this.velocity.x = minX * Math.sign(this.velocity.x); // Ensure minimum speed in the x direction
    }
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
