import { Vector2 } from "./Vector";
import { DELTA_TIME } from "./engine/gameLoop.js"; // TODO Take from ctx
import { GameObject } from "./engine/GameObject.js";

export class Ball extends GameObject {
  private position: Vector2 = new Vector2(0, 0);
  private velocity: Vector2 = new Vector2(0, 0);
  private readonly radius: number = 10; // Radius of the ball

  private readonly speed: number = 10;

  // -- REQUIREMENTS FUNCTION --

  onInstantiate(): void {
    this.startPosition(new Vector2(400, 300)); // Start position of the ball (Pos base on Pong scale) TODO: Get Scale from the context
  }

  update() {
    this.move();
  }

  // -- END REQUIREMENTS FUNCTION --

  move() {
    this.velocity = this.velocity.normalize().scale(this.speed); // Ensure the ball moves at a constant speed ( Possible to change for acceleration later )
    this.position = this.position.add(this.velocity.scale(DELTA_TIME)); // Update position based on velocity and delta time
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }


  snapshot() {
    return {
      position: this.position,
      velocity: this.velocity,
      radius: this.radius
    };
  }
}
