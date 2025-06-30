import { Vector2 } from '../core/physics/Vector.js';
import { GameObject } from '../core/GameObject.js';
import { Rectangle } from '../core/physics/Shapes.js';
import { SceneContext } from '../core/runtime/SceneContext.js';

export class Paddle extends GameObject implements Rectangle {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(10, 100); // Width and height of the paddle
  private speed: number = 300; // Speed of the paddle movement
  public velocity: Vector2 = new Vector2(0, 0); // Velocity of the paddle movement

  private id: string = '';

  constructor(id: string, pos: Vector2) {
    super();

    console.log('Paddle Constructor', id);
    this.id = id;
    this.startPosition(pos); // Set the initial position of the paddle
  }

  // -- REQUIREMENTS FUNCTION --

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  update() {
    this.calcutateInput();
    this.move();
  }


  // -- END REQUIREMENTS FUNCTION --

  calcutateInput() {
    const playerInput = SceneContext.get().inputManager.get(this.id);
    if (playerInput) {
      if (playerInput.up) {
        this.velocity.y = -1; // Move up
      } else if (playerInput.down) {
        this.velocity.y = 1; // Move down
      } else {
        this.velocity.y = 0; // Stop moving
      }
    }
  }

  clampPosition(max: number, min: number) {
    // Clamp the paddle position to stay within the game area
    if (this.position.y < min) {
      this.position.y = min;
    } else if (this.position.y + this.scale.y > max) {
      this.position.y = max - this.scale.y;
    }
  }

  move() {
    this.velocity = this.velocity.normalize().scale(this.speed);
    this.position = this.position.add(this.velocity.scale(SceneContext.get().loopManager.deltaTime)); // Update position based on velocity and delta time
    this.clampPosition(600 - 10, 0 + 10); // Clamp the paddle position to stay within the game area
  }

  collider(): Rectangle {
    return {
      position: this.position,
      scale: this.scale
    };
  }

  snapshot() {
    return {
      type: 'paddle',
      id: this.id, // TODO : Make this dynamic or unique per paddle
      position: this.position,
      scale: this.scale
    };
  }
}
