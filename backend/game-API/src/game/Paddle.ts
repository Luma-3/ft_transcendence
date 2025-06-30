import { Vector2 } from '../core/physics/Vector.js';
import { GameObject } from '../core/GameObject.js';
import { Rectangle } from '../core/physics/Shapes.js';
import { SceneContext } from '../core/runtime/SceneContext.js';

export class Paddle extends GameObject implements Rectangle {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(10, 100);
  public velocity: Vector2 = new Vector2(0, 0);
  private id: string = '';

  private readonly speed: number = 300;
  constructor(id: string, pos: Vector2) {
    super();

    this.id = id;
    this.startPosition(pos);
  }

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

  move() {
    const playerInput = SceneContext.get().inputManager.get(this.id);

    if (!playerInput) return;
    this.velocity = new Vector2(0, 0);
    if (playerInput.up) {
      this.velocity.y -= 1;
    }
    if (playerInput.down) {
      this.velocity.y += 1;
    }

    this.position = this.position.add(this.velocity.scale(this.speed * SceneContext.get().loopManager.deltaTime));
  }

  startPosition(pos: Vector2) {
    this.position = pos;
  }

  snapshot() {
    return {
      type: 'paddle',
      id: this.id,
      position: this.position,
      scale: this.scale
    };
  }
}
