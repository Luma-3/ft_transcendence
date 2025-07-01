import { GameObject } from '../core/GameObject.js';
import { Vector2 } from '../core/physics/Vector.js';

export class EdgeCollider extends GameObject {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(800, 1); // Width and height of the edge collider

  constructor(pos: Vector2) {
    super();
    this.position = pos;
  }

  collider() {
    return {
      position: this.position,
      scale: this.scale
    };
  }


  snapshot() {
    return {
      type: 'edgeCollider',
      id: 'edgeCollider',
      position: this.position,
      scale: this.scale
    };
  }
}
