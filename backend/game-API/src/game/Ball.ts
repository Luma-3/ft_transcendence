import { Vector2 } from "../core/physics/Vector.js";
import { GameObject } from "../core/GameObject.js";
import { Circle } from "../core/physics/Shapes.js";
import { SceneContext } from "../core/runtime/SceneContext.js";

export class Ball extends GameObject implements Circle {
  private velocity: Vector2 = new Vector2(-1, 0);

  public position: Vector2 = new Vector2(0, 0);
  public readonly radius: number = 10; // Radius of the ball

  private readonly speed: number = 100;

  // -- REQUIREMENTS FUNCTION --

  onInstantiate(): void {
    this.startPosition(new Vector2(400, 300)); // Start position of the ball (Pos base on Pong scale) TODO: Get Scale from the context
  }

  update() {
    this.move();
  }

  // Collider function returns parameter for collision detection (Collider Object if you want)
  collider(): Circle {
    return {
      position: this.position,
      radius: this.radius
    };
  }

  onCollision(other: GameObject): void {
    if (other instanceof Ball) {
      // Handle collision with another ball if needed
      console.log("Collision with another ball detected");
    } else {
      // Handle collision with paddles or other objects
      this.rebound();
    }
  }

  // -- END REQUIREMENTS FUNCTION --

  move() {
    this.velocity = this.velocity.normalize().scale(this.speed); // Ensure the ball moves at a constant speed ( Possible to change for acceleration later )
    this.position = this.position.add(this.velocity.scale(SceneContext.get().loopManager.deltaTime)); // Update position based on velocity and delta time
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  rebound() {
    // Reverse the ball's direction when it collides with a paddle
    this.velocity = this.velocity.scale(-1);
    // Optionally, adjust the position to avoid sticking to the paddle
    // this.position = this.position.add(this.velocity.scale(0.1)); // Small adjustment to prevent sticking
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
