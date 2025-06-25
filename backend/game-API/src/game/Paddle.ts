import { Vector2 } from '../core/physics/Vector.js';
import { GameObject } from '../core/GameObject.js';
import { Rectangle } from '../core/physics/Shapes.js';

export class Paddle extends GameObject implements Rectangle {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(10, 100); // Width and height of the paddle
  // private speed: number = 300; // Speed of the paddle movement

  private id: string = '';

  constructor(id: string, pos: Vector2) {
    super();

    console.log('Paddle Constructor', id);
    this.id = id;
    this.startPosition(pos); // Set the initial position of the paddle
  }

  // -- REQUIREMENTS FUNCTION --

  onInstantiate(): void {
  }

  update() {
    this.move();
  }

  collider(): Rectangle {
    return {
      position: this.position,
      scale: this.scale
    };
  }

  onCollision(other: GameObject): void {
    other = other; // Placeholder for collision handling
  }

  // -- END REQUIREMENTS FUNCTION --

  move() {
    // Paddle movement logic can be added here (e.g., based on user input)
    // For now, it remains stationary
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  snapshot() {
    return {
      id: 'paddle' + this.id, // TODO : Make this dynamic or unique per paddle
      position: this.position,
      scale: this.scale
    };
  }
}
