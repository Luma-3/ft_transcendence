import { Vector2 } from '../core/physics/Vector.js';
import { GameObject } from '../core/GameObject.js';
import { Rectangle } from '../core/physics/Shapes.js';
import { SceneContext } from '../core/runtime/SceneContext.js';

export class Paddle extends GameObject implements Rectangle {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(10, 100); // Width and height of the paddle
  public velocity: Vector2 = new Vector2(0, 0); // Velocity of the paddle movement

  private readonly velocityModifer: number = 400;
  private readonly frictionForce: number = 5;
  private readonly acceleration: number = 6;

  // private readonly maxVelocity: number = 10;
  private id: string = '';
  // private inMove = false;

  get Paddleid() {
    return this.id;
  }

  constructor(id: string, pos: Vector2) {
    super();

    this.id = id;
    this.startPosition(pos);
  }


  startPosition(pos: Vector2) {
    this.position = pos;
  }

  update() {
    this.move();
    this.calculateFriction();
    this.position = this.position.add(this.velocity.scale(SceneContext.get().loopManager.deltaTime));
    this.clampPosition(10, 590);
  }

  clampPosition(min: number, max: number) {
    // Clamp the paddle position to stay within the game area
    if (this.position.y < min + this.scale.y / 2) {
      this.position.y = min + this.scale.y / 2;
      this.velocity.y = 0;
    } else if (this.position.y > max - this.scale.y / 2) {
      this.position.y = max - this.scale.y / 2;
      this.velocity.y = 0;
    }
  }

  calculateFriction() {
    let vel = this.velocity;
    const friction = vel.scale(SceneContext.get().loopManager.deltaTime * this.frictionForce);
    vel = vel.sub(friction);
    this.velocity = vel;
  }

  move() {
    const playerInput = SceneContext.get().inputManager.get(this.id);
    if (!playerInput) return;

    const speed = playerInput.y * this.acceleration;
    this.velocity = this.velocity.add(new Vector2(0, -speed * SceneContext.get().loopManager.deltaTime * this.velocityModifer));
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
      id: this.id,
      position: this.position,
      velocity: this.velocity
    };
  }
}
