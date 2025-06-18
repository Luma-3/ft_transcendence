import { Vector2 } from "./Vector";
import { DELTA_TIME } from "./gameLoop";

export class Ball {
  private position: Vector2 = new Vector2(0, 0);
  private velocity: Vector2 = new Vector2(0, 0);
  private readonly radius: number = 10; // Radius of the ball

  private readonly speed: number = 10;

  constructor(position: Vector2, velocity: Vector2, radius: number) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }

  update() {
    this.move();
  }

  move() {
    this.velocity = this.velocity.normalize().scale(this.speed); // Ensure the ball moves at a constant speed ( Possible to change for acceleration later )
    this.position = this.position.add(this.velocity.scale(DELTA_TIME)); // Update position based on velocity and delta time
  }

  snapshot() {
    return {
      position: this.position,
      velocity: this.velocity,
      radius: this.radius
    };
  }
}
